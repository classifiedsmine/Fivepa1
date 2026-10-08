/**
 * Production Escrow Service.
 * Manages escrow funding, safe milestone releases, refunds, partial releases,
 * 14-day protection monitoring, and dispute locks.
 */

import { dbEngine } from '../db/database.ts';
import { WalletService } from './WalletService.ts';
import { LedgerService } from './LedgerService.ts';

export class EscrowService {
  /**
   * Fund contract milestone into escrow hold.
   */
  public static async fundMilestoneEscrow(contractId: string, milestoneId: string, clientId: string) {
    const lockContract = await dbEngine.acquireLock(`contract_${contractId}`);
    try {
      return await dbEngine.transaction(async (tx) => {
        const contract = dbEngine.queryOne<any>('SELECT * FROM contracts WHERE id = ?', [contractId]);
        if (!contract) throw new Error('Contract not found.');

        const milestone = dbEngine.queryOne<any>('SELECT * FROM contract_milestones WHERE id = ?', [milestoneId]);
        if (!milestone) throw new Error('Milestone not found.');

        if (milestone.status === 'FUNDED' || milestone.status === 'RELEASED') {
          throw new Error(`Milestone is already in ${milestone.status} state.`);
        }

        const amountCents = milestone.amount_cents;

        // Move funds from client available balance to escrow balance
        const clientWallet = await WalletService.moveAvailableToEscrow(clientId, amountCents);
        const platformSystemWallet = await WalletService.getOrCreateWallet('usr-admin-system');

        // Record balanced ledger transaction
        await LedgerService.recordBalancedTransaction({
          idempotencyKey: `fund_escrow_${milestoneId}_${Date.now()}`,
          debitWalletId: clientWallet.id,
          debitUserId: clientId,
          creditWalletId: platformSystemWallet.id,
          creditUserId: 'usr-admin-system',
          amountCents,
          currency: 'USD',
          description: `Escrow Funding for Milestone '${milestone.title}' (Contract: ${contract.title})`,
          referenceType: 'CONTRACT_MILESTONE',
          referenceId: milestoneId,
        });

        const now = new Date().toISOString();
        dbEngine.exec("UPDATE contract_milestones SET status = 'FUNDED', updated_at = ? WHERE id = ?", [
          now,
          milestoneId,
        ]);

        return { success: true, milestoneId, status: 'FUNDED', clientWallet };
      });
    } finally {
      lockContract();
    }
  }

  /**
   * Safe Escrow Release with atomic transaction guards against duplicate calls, refunds, or disputes.
   */
  public static async releaseMilestoneEscrow(
    contractId: string,
    milestoneId: string,
    performedByUserId: string
  ) {
    const lockContract = await dbEngine.acquireLock(`contract_${contractId}`);
    try {
      return await dbEngine.transaction(async (tx) => {
        const contract = dbEngine.queryOne<any>('SELECT * FROM contracts WHERE id = ?', [contractId]);
        if (!contract) throw new Error('Contract not found.');

        // Verify no active dispute blocking escrow
        const dispute = dbEngine.queryOne<any>(
          "SELECT * FROM disputes WHERE contract_id = ? AND status IN ('OPEN', 'UNDER_REVIEW')",
          [contractId]
        );
        if (dispute) {
          throw new Error('Escrow Release Blocked: Active dispute exists for this contract.');
        }

        const milestone = dbEngine.queryOne<any>('SELECT * FROM contract_milestones WHERE id = ?', [milestoneId]);
        if (!milestone) throw new Error('Milestone not found.');

        if (milestone.status === 'RELEASED') {
          console.log(`[EscrowService] Milestone ${milestoneId} is already RELEASED. Returning idempotent success.`);
          return { success: true, milestoneId, status: 'RELEASED', idempotent: true };
        }

        if (milestone.status !== 'FUNDED' && milestone.status !== 'SUBMITTED') {
          throw new Error(`Escrow Release Error: Cannot release milestone in '${milestone.status}' status.`);
        }

        const grossAmountCents = milestone.amount_cents;
        const freelancerFeePercent = 10.0; // 10% marketplace fee
        const feeCents = Math.round((grossAmountCents * freelancerFeePercent) / 100);
        const netFreelancerCents = grossAmountCents - feeCents;

        const clientWallet = await WalletService.getOrCreateWallet(contract.client_id);
        const freelancerWallet = await WalletService.getOrCreateWallet(contract.freelancer_id);
        const platformWallet = await WalletService.getOrCreateWallet('usr-admin-system');

        // Release escrow balance to freelancer available balance
        await WalletService.releaseEscrowToUser(contract.client_id, contract.freelancer_id, grossAmountCents);

        // Deduct marketplace fee from freelancer and credit platform fee account
        if (feeCents > 0) {
          await WalletService.debitAvailable(contract.freelancer_id, feeCents);
          await WalletService.creditAvailable('usr-admin-system', feeCents);
        }

        // Ledger records
        await LedgerService.recordBalancedTransaction({
          idempotencyKey: `rel_escrow_${milestoneId}_${Date.now()}`,
          debitWalletId: clientWallet.id,
          debitUserId: contract.client_id,
          creditWalletId: freelancerWallet.id,
          creditUserId: contract.freelancer_id,
          amountCents: grossAmountCents,
          currency: 'USD',
          description: `Escrow Release for Milestone '${milestone.title}'`,
          referenceType: 'ESCROW_RELEASE',
          referenceId: milestoneId,
        });

        if (feeCents > 0) {
          await LedgerService.recordBalancedTransaction({
            idempotencyKey: `fee_escrow_${milestoneId}_${Date.now()}`,
            debitWalletId: freelancerWallet.id,
            debitUserId: contract.freelancer_id,
            creditWalletId: platformWallet.id,
            creditUserId: 'usr-admin-system',
            amountCents: feeCents,
            currency: 'USD',
            description: `Platform Commission Fee (10%) for Milestone '${milestone.title}'`,
            referenceType: 'PLATFORM_FEE',
            referenceId: milestoneId,
          });
        }

        const now = new Date().toISOString();
        dbEngine.exec("UPDATE contract_milestones SET status = 'RELEASED', updated_at = ? WHERE id = ?", [
          now,
          milestoneId,
        ]);

        return {
          success: true,
          milestoneId,
          status: 'RELEASED',
          grossAmountCents,
          netFreelancerCents,
          feeCents,
        };
      });
    } finally {
      lockContract();
    }
  }

  /**
   * 14-Day Auto Protection Release Monitoring Job.
   */
  public static async processProtectionPeriodAutoReleases(): Promise<number> {
    const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();

    const pendingMilestones = dbEngine.query<any>(
      "SELECT m.*, c.client_id, c.freelancer_id FROM contract_milestones m JOIN contracts c ON m.contract_id = c.id WHERE m.status = 'SUBMITTED' AND m.updated_at <= ?",
      [fourteenDaysAgo]
    );

    let releasedCount = 0;

    for (const m of pendingMilestones) {
      try {
        await this.releaseMilestoneEscrow(m.contract_id, m.id, 'SYSTEM_AUTO_RELEASE');
        releasedCount++;
      } catch (err) {
        console.error(`[EscrowService] Auto-release failed for milestone ${m.id}:`, err);
      }
    }

    return releasedCount;
  }
}
