/**
 * Automated Production Readiness & Financial Integrity Test Suite.
 * Executes automated integration tests covering concurrency, locking,
 * double-entry ledger balance, withdrawal safety, and escrow protection.
 */

import { dbEngine } from '../server/db/database.ts';
import { MigrationRunner } from '../server/db/migration.ts';
import { WalletService } from '../server/services/WalletService.ts';
import { LedgerService } from '../server/services/LedgerService.ts';
import { EscrowService } from '../server/services/EscrowService.ts';
import { WithdrawalService } from '../server/services/WithdrawalService.ts';
import { PaymentService } from '../server/services/PaymentService.ts';
import { DisputeService } from '../server/services/DisputeService.ts';
import { ReconciliationService } from '../server/services/ReconciliationService.ts';

export async function runProductionReadinessTests(): Promise<{
  passed: boolean;
  totalTests: number;
  passCount: number;
  failCount: number;
  results: Array<{ name: string; success: boolean; details: string }>;
}> {
  console.log('[Test Suite] Running Automated Production Readiness & Financial Integrity Verification...');

  await MigrationRunner.runMigrations();

  const results: Array<{ name: string; success: boolean; details: string }> = [];

  const recordResult = (name: string, success: boolean, details: string) => {
    results.push({ name, success, details });
    console.log(`[Test] ${success ? 'PASSED' : 'FAILED'}: ${name} - ${details}`);
  };

  // Test 1: Double-Entry Ledger Debit == Credit
  try {
    const recon = await ReconciliationService.runReconciliationAudit();
    const ledgerDiscrepancy = recon.discrepancies.find((d) => d.type === 'LEDGER_UNBALANCED');
    if (!ledgerDiscrepancy) {
      recordResult('Double-Entry Ledger Balance', true, 'Total Debits equal Total Credits across all ledger records.');
    } else {
      recordResult('Double-Entry Ledger Balance', false, `Ledger unbalanced: ${ledgerDiscrepancy.differenceCents} cents diff.`);
    }
  } catch (err: any) {
    recordResult('Double-Entry Ledger Balance', false, err.message);
  }

  // Test 2: Concurrent Withdrawal Overspend Protection ($700 + $700 on $1000 balance)
  try {
    const testUserId = 'test_usr_wdr';
    await WalletService.getOrCreateWallet(testUserId);

    // Reset balance to zero first to ensure test isolation across multiple runs
    dbEngine.exec('UPDATE wallets SET available_cents = 0 WHERE user_id = ?', [testUserId]);

    await WalletService.creditAvailable(testUserId, 100000); // $1,000.00 (100,000 cents)

    const req1 = WithdrawalService.requestWithdrawal({
      idempotencyKey: `wdr_test_1_${Date.now()}`,
      userId: testUserId,
      amountCents: 70000, // $700.00
      paymentMethod: 'Bank Wire',
      accountDetails: 'ACCT_123',
    });

    const req2 = WithdrawalService.requestWithdrawal({
      idempotencyKey: `wdr_test_2_${Date.now()}`,
      userId: testUserId,
      amountCents: 70000, // $700.00
      paymentMethod: 'Bank Wire',
      accountDetails: 'ACCT_123',
    });

    const outcomes = await Promise.allSettled([req1, req2]);
    const succeededCount = outcomes.filter((o) => o.status === 'fulfilled').length;
    const failedCount = outcomes.filter((o) => o.status === 'rejected').length;

    if (succeededCount === 1 && failedCount === 1) {
      recordResult(
        'Concurrent Withdrawal Overspend Protection',
        true,
        'Exactly 1 of 2 concurrent $700 withdrawal requests succeeded on a $1,000 balance.'
      );
    } else {
      recordResult(
        'Concurrent Withdrawal Overspend Protection',
        false,
        `Expected 1 pass & 1 fail, got ${succeededCount} pass & ${failedCount} fail.`
      );
    }
  } catch (err: any) {
    recordResult('Concurrent Withdrawal Overspend Protection', false, err.message);
  }

  // Test 3: Idempotent Payment Webhook Ingestion
  try {
    const webhookEventId = `wh_test_evt_${Date.now()}`;
    const testPayload = {
      provider: 'RAZORPAY' as const,
      eventId: webhookEventId,
      eventType: 'payment.captured',
      userId: 'usr-1',
      amountCents: 5000, // $50.00
      currency: 'USD',
      rawPayload: { test: true },
    };

    const res1 = await PaymentService.handleVerifiedWebhook(testPayload);
    const res2 = await PaymentService.handleVerifiedWebhook(testPayload);

    if (res1.status === 'PROCESSED' && res2.status === 'SKIPPED_DUPLICATE') {
      recordResult('Idempotent Webhook Processing', true, 'First event processed, duplicate event safely skipped.');
    } else {
      recordResult('Idempotent Webhook Processing', false, `Status 1: ${res1.status}, Status 2: ${res2.status}`);
    }
  } catch (err: any) {
    recordResult('Idempotent Webhook Processing', false, err.message);
  }

  // Test 4: Dispute Blocks Escrow Release
  try {
    const contractId = 'ctr-401';
    const milestoneId = 'mls-503'; // FUNDED milestone

    // Clean up any existing dispute for this contract to ensure test re-runnability
    dbEngine.exec('DELETE FROM disputes WHERE contract_id = ?', [contractId]);
    dbEngine.exec("UPDATE contracts SET status = 'ACTIVE' WHERE id = ?", [contractId]);

    await DisputeService.fileDispute({
      contractId,
      disputedBy: 'usr-1',
      reason: 'Quality issue',
    });

    try {
      await EscrowService.releaseMilestoneEscrow(contractId, milestoneId, 'usr-1');
      recordResult('Dispute Escrow Lock Protection', false, 'Escrow release succeeded despite active dispute!');
    } catch (err: any) {
      if (err.message.includes('Active dispute exists')) {
        recordResult('Dispute Escrow Lock Protection', true, 'Escrow release successfully blocked by active dispute lock.');
      } else {
        recordResult('Dispute Escrow Lock Protection', false, `Unexpected error: ${err.message}`);
      }
    }
  } catch (err: any) {
    recordResult('Dispute Escrow Lock Protection', false, err.message);
  }

  const passCount = results.filter((r) => r.success).length;
  const failCount = results.filter((r) => !r.success).length;

  return {
    passed: failCount === 0,
    totalTests: results.length,
    passCount,
    failCount,
    results,
  };
}
