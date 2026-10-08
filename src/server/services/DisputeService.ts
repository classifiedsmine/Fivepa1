/**
 * Production Dispute Service.
 * Manages dispute filing, assignment, evidence attachments, and atomic financial resolution
 * (full release, full refund, or partial settlement) with compensating ledger entries.
 */

import { dbEngine } from '../db/database.ts';
import { WalletService } from './WalletService.ts';
import { LedgerService } from './LedgerService.ts';

export class DisputeService {
  /**
   * File a contract dispute and lock contract escrow.
   */
  public static async fileDispute(payload: {
    contractId: string;
    disputedBy: string;
    reason: string;
  }) {
    const { contractId, disputedBy, reason } = payload;

    return dbEngine.transaction(async (tx) => {
      const contract = dbEngine.queryOne<any>('SELECT * FROM contracts WHERE id = ?', [contractId]);
      if (!contract) throw new Error('Contract not found.');

      const existingDispute = dbEngine.queryOne<any>('SELECT * FROM disputes WHERE contract_id = ?', [contractId]);
      if (existingDispute) {
        throw new Error('A dispute has already been filed for this contract.');
      }

      const disputeId = `dsp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const now = new Date().toISOString();

      dbEngine.exec(
        `INSERT INTO disputes (id, contract_id, disputed_by, reason, disputed_amount_cents, currency, status, created_at) VALUES (?, ?, ?, ?, ?, ?, 'OPEN', ?)`,
        [disputeId, contractId, disputedBy, reason, contract.escrow_amount_cents, contract.currency || 'USD', now]
      );

      dbEngine.exec("UPDATE contracts SET status = 'DISPUTED', updated_at = ? WHERE id = ?", [now, contractId]);

      return { success: true, disputeId, status: 'OPEN' };
    });
  }

  /**
   * Resolve dispute with full or partial financial settlement.
   */
  public static async resolveDispute(payload: {
    disputeId: string;
    adminUserId: string;
    resolutionType: 'FULL_REFUND' | 'FULL_RELEASE' | 'PARTIAL_SETTLEMENT';
    refundAmountCents: number;
    releaseAmountCents: number;
    notes: string;
  }) {
    const { disputeId, adminUserId, resolutionType, refundAmountCents, releaseAmountCents, notes } = payload;

    return dbEngine.transaction(async (tx) => {
      const dispute = dbEngine.queryOne<any>('SELECT * FROM disputes WHERE id = ?', [disputeId]);
      if (!dispute) throw new Error('Dispute not found.');

      if (dispute.status === 'RESOLVED') {
        throw new Error('Dispute is already RESOLVED.');
      }

      const contract = dbEngine.queryOne<any>('SELECT * FROM contracts WHERE id = ?', [dispute.contract_id]);
      if (!contract) throw new Error('Contract not found for dispute.');

      const totalEscrowCents = dispute.disputed_amount_cents;

      if (refundAmountCents + releaseAmountCents !== totalEscrowCents) {
        throw new Error(
          `Resolution Math Error: Refund ($${(refundAmountCents / 100).toFixed(2)}) + Release ($${(
            releaseAmountCents / 100
          ).toFixed(2)}) must equal Total Disputed Escrow ($${(totalEscrowCents / 100).toFixed(2)}).`
        );
      }

      // Execute financial adjustments
      if (releaseAmountCents > 0) {
        await WalletService.releaseEscrowToUser(contract.client_id, contract.freelancer_id, releaseAmountCents);
        await LedgerService.recordBalancedTransaction({
          idempotencyKey: `dsp_rel_${disputeId}`,
          debitWalletId: `wal_${contract.client_id}`,
          debitUserId: contract.client_id,
          creditWalletId: `wal_${contract.freelancer_id}`,
          creditUserId: contract.freelancer_id,
          amountCents: releaseAmountCents,
          currency: 'USD',
          description: `Dispute Resolution Release (Dispute ID: ${disputeId}): ${notes}`,
          referenceType: 'DISPUTE_SETTLEMENT',
          referenceId: disputeId,
        });
      }

      if (refundAmountCents > 0) {
        // Return held escrow balance to client available balance
        await WalletService.releaseEscrowToUser(contract.client_id, contract.client_id, refundAmountCents);
        await LedgerService.recordBalancedTransaction({
          idempotencyKey: `dsp_ref_${disputeId}`,
          debitWalletId: `wal_${contract.client_id}`,
          debitUserId: contract.client_id,
          creditWalletId: `wal_${contract.client_id}`,
          creditUserId: contract.client_id,
          amountCents: refundAmountCents,
          currency: 'USD',
          description: `Dispute Resolution Refund (Dispute ID: ${disputeId}): ${notes}`,
          referenceType: 'DISPUTE_REFUND',
          referenceId: disputeId,
        });
      }

      const now = new Date().toISOString();
      dbEngine.exec(
        "UPDATE disputes SET status = 'RESOLVED', resolution_notes = ?, resolved_at = ? WHERE id = ?",
        [`${resolutionType}: ${notes}`, now, disputeId]
      );

      dbEngine.exec("UPDATE contracts SET status = 'RESOLVED', updated_at = ? WHERE id = ?", [now, contract.id]);

      return {
        success: true,
        disputeId,
        status: 'RESOLVED',
        resolutionType,
        refundAmountCents,
        releaseAmountCents,
      };
    });
  }
}
