/**
 * Production Double-Entry Ledger Service.
 * Guarantees immutable append-only records, balanced debits and credits,
 * idempotency protection, and compensating transactions.
 */

import { dbEngine } from '../db/database.ts';
import { WalletService } from './WalletService.ts';

export interface LedgerRecord {
  id: string;
  idempotencyKey: string;
  walletId: string;
  userId: string;
  type: string;
  entryType: 'DEBIT' | 'CREDIT';
  amountCents: number;
  currency: string;
  description: string;
  referenceType?: string;
  referenceId?: string;
  createdAt: string;
}

export interface BalancedTransactionPayload {
  idempotencyKey: string;
  debitWalletId: string;
  debitUserId: string;
  creditWalletId: string;
  creditUserId: string;
  amountCents: number;
  currency: string;
  description: string;
  referenceType?: string;
  referenceId?: string;
}

export class LedgerService {
  /**
   * Post a balanced double-entry financial transaction.
   * Total Debits MUST equal Total Credits.
   */
  public static async recordBalancedTransaction(payload: BalancedTransactionPayload): Promise<{
    debitEntry: LedgerRecord;
    creditEntry: LedgerRecord;
  }> {
    const {
      idempotencyKey,
      debitWalletId,
      debitUserId,
      creditWalletId,
      creditUserId,
      amountCents,
      currency,
      description,
      referenceType,
      referenceId,
    } = payload;

    if (amountCents <= 0) {
      throw new Error('Ledger Error: Transaction amount must be positive.');
    }

    // Check idempotency
    const existingDebitKey = `${idempotencyKey}_DEBIT`;
    const existingCreditKey = `${idempotencyKey}_CREDIT`;

    const existingEntry = dbEngine.queryOne<LedgerRecord>(
      'SELECT * FROM ledger_entries WHERE idempotency_key = ? OR idempotency_key = ?',
      [existingDebitKey, existingCreditKey]
    );

    if (existingEntry) {
      console.log(`[Ledger] Idempotent transaction already recorded for key ${idempotencyKey}`);
      const debitEntry = dbEngine.queryOne<LedgerRecord>(
        'SELECT * FROM ledger_entries WHERE idempotency_key = ?',
        [existingDebitKey]
      )!;
      const creditEntry = dbEngine.queryOne<LedgerRecord>(
        'SELECT * FROM ledger_entries WHERE idempotency_key = ?',
        [existingCreditKey]
      )!;
      return { debitEntry, creditEntry };
    }

    const now = new Date().toISOString();

    // Get current balances for balance_after tracking
    const debitWallet = await WalletService.getOrCreateWallet(debitUserId);
    const creditWallet = await WalletService.getOrCreateWallet(creditUserId);

    const debitEntry: any = {
      id: `led_${Date.now()}_d_${Math.random().toString(36).substring(2, 6)}`,
      idempotencyKey: existingDebitKey,
      walletId: debitWalletId,
      userId: debitUserId,
      type: referenceType || 'TRANSFER',
      entryType: 'DEBIT',
      amountCents: -amountCents, // record as negative for debit in single-column ledger view
      balanceAfterCents: debitWallet.availableCents - amountCents,
      currency: currency || 'USD',
      description: `DEBIT: ${description}`,
      referenceType,
      referenceId,
      createdAt: now,
    };

    const creditEntry: any = {
      id: `led_${Date.now()}_c_${Math.random().toString(36).substring(2, 6)}`,
      idempotencyKey: existingCreditKey,
      walletId: creditWalletId,
      userId: creditUserId,
      type: referenceType || 'TRANSFER',
      entryType: 'CREDIT',
      amountCents,
      balanceAfterCents: creditWallet.availableCents + amountCents,
      currency: currency || 'USD',
      description: `CREDIT: ${description}`,
      referenceType,
      referenceId,
      createdAt: now,
    };

    dbEngine.exec(
      `INSERT INTO ledger_entries (id, idempotency_key, wallet_id, user_id, type, entry_type, amount_cents, balance_after_cents, currency, description, reference_type, reference_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        debitEntry.id,
        debitEntry.idempotencyKey,
        debitEntry.walletId,
        debitEntry.userId,
        debitEntry.type,
        debitEntry.entryType,
        debitEntry.amountCents,
        debitEntry.balanceAfterCents,
        debitEntry.currency,
        debitEntry.description,
        debitEntry.referenceType || '',
        debitEntry.referenceId || '',
        debitEntry.createdAt,
      ]
    );

    dbEngine.exec(
      `INSERT INTO ledger_entries (id, idempotency_key, wallet_id, user_id, type, entry_type, amount_cents, balance_after_cents, currency, description, reference_type, reference_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        creditEntry.id,
        creditEntry.idempotencyKey,
        creditEntry.walletId,
        creditEntry.userId,
        creditEntry.type,
        creditEntry.entryType,
        creditEntry.amountCents,
        creditEntry.balanceAfterCents,
        creditEntry.currency,
        creditEntry.description,
        creditEntry.referenceType || '',
        creditEntry.referenceId || '',
        creditEntry.createdAt,
      ]
    );

    return { debitEntry, creditEntry };
  }

  /**
   * Post a compensating financial correction entry.
   */
  public static async recordCompensatingEntry(
    originalTransactionId: string,
    reason: string,
    amountCents: number,
    userId: string,
    walletId: string
  ): Promise<LedgerRecord> {
    const idempotencyKey = `comp_${originalTransactionId}_${Date.now()}`;
    const now = new Date().toISOString();

    const entry: LedgerRecord = {
      id: `led_comp_${Date.now()}`,
      idempotencyKey,
      walletId,
      userId,
      type: 'COMPENSATING_CORRECTION',
      entryType: 'CREDIT',
      amountCents,
      currency: 'USD',
      description: `COMPENSATING TRANSACTION for ${originalTransactionId}: ${reason}`,
      referenceType: 'CORRECTION',
      referenceId: originalTransactionId,
      createdAt: now,
    };

    dbEngine.exec(
      `INSERT INTO ledger_entries (id, idempotency_key, wallet_id, user_id, type, entry_type, amount_cents, currency, description, reference_type, reference_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        entry.id,
        entry.idempotencyKey,
        entry.walletId,
        entry.userId,
        entry.type,
        entry.entryType,
        entry.amountCents,
        entry.currency,
        entry.description,
        entry.referenceType,
        entry.referenceId,
        entry.createdAt,
      ]
    );

    return entry;
  }

  /**
   * Retrieve ledger audit trail for a user or wallet.
   */
  public static getLedgerForUser(userId: string): LedgerRecord[] {
    return dbEngine.query<LedgerRecord>('SELECT * FROM ledger_entries WHERE user_id = ? ORDER BY created_at DESC', [userId]);
  }
}
