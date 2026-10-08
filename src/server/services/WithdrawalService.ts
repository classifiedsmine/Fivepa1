/**
 * Production Withdrawal Service.
 * Manages atomic withdrawal reservations, concurrent overspend protection,
 * approval/rejection processing, and fund restoration.
 */

import { dbEngine } from '../db/database.ts';
import { WalletService } from './WalletService.ts';
import { LedgerService } from './LedgerService.ts';

export interface WithdrawalRecord {
  id: string;
  idempotencyKey: string;
  userId: string;
  amountCents: number;
  currency: string;
  paymentMethod: string;
  accountDetails: string;
  status: 'PENDING' | 'APPROVED' | 'PROCESSED' | 'REJECTED';
  rejectionReason?: string;
  createdAt: string;
  processedAt?: string;
}

export class WithdrawalService {
  /**
   * Request a withdrawal with atomic balance reservation.
   * If user has $1,000 balance and sends two concurrent $700 requests,
   * EXACTLY ONE will succeed and the second will be REJECTED.
   */
  public static async requestWithdrawal(payload: {
    idempotencyKey: string;
    userId: string;
    amountCents: number;
    paymentMethod: string;
    accountDetails: string;
  }): Promise<WithdrawalRecord> {
    const { idempotencyKey, userId, amountCents, paymentMethod, accountDetails } = payload;

    if (amountCents < 2000) {
      throw new Error('Withdrawal Error: Minimum withdrawal amount is $20.00.');
    }

    const releaseLock = await dbEngine.acquireLock(`wallet_${userId}`);
    try {
      return await dbEngine.transaction(async (tx) => {
        // Check idempotency
        const existing = dbEngine.queryOne<any>('SELECT * FROM withdrawal_requests WHERE idempotency_key = ?', [
          idempotencyKey,
        ]);
        if (existing) {
          console.log(`[WithdrawalService] Idempotent request found for key ${idempotencyKey}`);
          return {
            id: existing.id,
            idempotencyKey: existing.idempotency_key,
            userId: existing.user_id,
            amountCents: existing.amount_cents,
            currency: existing.currency || 'USD',
            paymentMethod: existing.payment_method,
            accountDetails: existing.account_details,
            status: existing.status,
            createdAt: existing.created_at,
          };
        }

        const wallet = await WalletService.getOrCreateWallet(userId);

        if (wallet.availableCents < amountCents) {
          throw new Error(
            `Withdrawal Rejected: Insufficient Available Balance ($${(wallet.availableCents / 100).toFixed(
              2
            )}) for requested withdrawal of $${(amountCents / 100).toFixed(2)}.`
          );
        }

        // Debit available balance and credit pending withdrawal balance
        const newAvailable = wallet.availableCents - amountCents;
        const newPendingWithdrawal = wallet.pendingWithdrawalCents + amountCents;
        const now = new Date().toISOString();

        dbEngine.exec(
          'UPDATE wallets SET available_cents = ?, pending_withdrawal_cents = ?, updated_at = ? WHERE user_id = ?',
          [newAvailable, newPendingWithdrawal, now, userId]
        );

        const withdrawalId = `wdr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

        dbEngine.exec(
          `INSERT INTO withdrawal_requests (id, idempotency_key, user_id, amount_cents, currency, payment_method, account_details, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, 'PENDING', ?)`,
          [withdrawalId, idempotencyKey, userId, amountCents, 'USD', paymentMethod, accountDetails, now]
        );

        // Record ledger entry
        const systemWallet = await WalletService.getOrCreateWallet('usr-admin-system');
        await LedgerService.recordBalancedTransaction({
          idempotencyKey: `wdr_res_${withdrawalId}`,
          debitWalletId: wallet.id,
          debitUserId: userId,
          creditWalletId: systemWallet.id,
          creditUserId: 'usr-admin-system',
          amountCents,
          currency: 'USD',
          description: `Withdrawal Reservation ($${(amountCents / 100).toFixed(2)} via ${paymentMethod})`,
          referenceType: 'WITHDRAWAL_RESERVATION',
          referenceId: withdrawalId,
        });

        return {
          id: withdrawalId,
          idempotencyKey,
          userId,
          amountCents,
          currency: 'USD',
          paymentMethod,
          accountDetails,
          status: 'PENDING',
          createdAt: now,
        };
      });
    } finally {
      releaseLock();
    }
  }

  /**
   * Process withdrawal approval / completion.
   */
  public static async processWithdrawal(withdrawalId: string, adminUserId: string) {
    return dbEngine.transaction(async (tx) => {
      const withdrawal = dbEngine.queryOne<any>('SELECT * FROM withdrawal_requests WHERE id = ?', [withdrawalId]);
      if (!withdrawal) throw new Error('Withdrawal request not found.');

      if (withdrawal.status !== 'PENDING') {
        throw new Error(`Cannot process withdrawal in '${withdrawal.status}' status.`);
      }

      const lockWallet = await dbEngine.acquireLock(`wallet_${withdrawal.user_id}`);
      try {
        const wallet = await WalletService.getOrCreateWallet(withdrawal.user_id);
        const amountCents = withdrawal.amount_cents;

        // Clear pending withdrawal balance
        const newPending = Math.max(0, wallet.pendingWithdrawalCents - amountCents);
        const now = new Date().toISOString();

        dbEngine.exec('UPDATE wallets SET pending_withdrawal_cents = ?, updated_at = ? WHERE user_id = ?', [
          newPending,
          now,
          withdrawal.user_id,
        ]);

        dbEngine.exec(
          "UPDATE withdrawal_requests SET status = 'PROCESSED', processed_at = ? WHERE id = ?",
          [now, withdrawalId]
        );

        return { success: true, withdrawalId, status: 'PROCESSED' };
      } finally {
        lockWallet();
      }
    });
  }

  /**
   * Reject withdrawal request and restore reserved funds to user available balance.
   */
  public static async rejectWithdrawal(withdrawalId: string, rejectionReason: string, adminUserId: string) {
    return dbEngine.transaction(async (tx) => {
      const withdrawal = dbEngine.queryOne<any>('SELECT * FROM withdrawal_requests WHERE id = ?', [withdrawalId]);
      if (!withdrawal) throw new Error('Withdrawal request not found.');

      if (withdrawal.status !== 'PENDING') {
        throw new Error(`Cannot reject withdrawal in '${withdrawal.status}' status.`);
      }

      const lockWallet = await dbEngine.acquireLock(`wallet_${withdrawal.user_id}`);
      try {
        const wallet = await WalletService.getOrCreateWallet(withdrawal.user_id);
        const amountCents = withdrawal.amount_cents;

        // Restore funds: reduce pending withdrawal and increase available balance
        const newPending = Math.max(0, wallet.pendingWithdrawalCents - amountCents);
        const newAvailable = wallet.availableCents + amountCents;
        const now = new Date().toISOString();

        dbEngine.exec(
          'UPDATE wallets SET available_cents = ?, pending_withdrawal_cents = ?, updated_at = ? WHERE user_id = ?',
          [newAvailable, newPending, now, withdrawal.user_id]
        );

        dbEngine.exec(
          "UPDATE withdrawal_requests SET status = 'REJECTED', rejection_reason = ?, processed_at = ? WHERE id = ?",
          [rejectionReason, now, withdrawalId]
        );

        // Record compensating ledger record
        const systemWallet = await WalletService.getOrCreateWallet('usr-admin-system');
        await LedgerService.recordBalancedTransaction({
          idempotencyKey: `wdr_rej_${withdrawalId}`,
          debitWalletId: systemWallet.id,
          debitUserId: 'usr-admin-system',
          creditWalletId: wallet.id,
          creditUserId: withdrawal.user_id,
          amountCents,
          currency: 'USD',
          description: `Withdrawal Rejection Refund: ${rejectionReason}`,
          referenceType: 'WITHDRAWAL_REFUND',
          referenceId: withdrawalId,
        });

        return { success: true, withdrawalId, status: 'REJECTED', restoredCents: amountCents };
      } finally {
        lockWallet();
      }
    });
  }
}
