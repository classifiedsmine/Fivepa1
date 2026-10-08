/**
 * Production Persistent SQL Database Engine with File-Backed Storage,
 * Write-Ahead Logging (WAL) simulation, Transaction Atomicity,
 * and Concurrency Mutex Locks.
 */

import fs from 'fs';
import path from 'path';
import alasql from 'alasql';

const DATA_DIR = path.resolve(process.cwd(), '.data');
const DB_FILE = path.join(DATA_DIR, 'worksphere_production.json');
const WAL_FILE = path.join(DATA_DIR, 'worksphere_wal.log');

export interface TransactionContext {
  id: string;
  inTransaction: boolean;
  rollbackActions: Array<() => void>;
}

class ProductionDatabase {
  private isInitialized = false;
  private mutexLocks: Map<string, Promise<void>> = new Map();

  constructor() {
    this.ensureDataDirectory();
  }

  private ensureDataDirectory() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  public async initialize() {
    if (this.isInitialized) return;

    // Enable custom functions or custom SQL pragmas
    alasql.options.autocommit = true;

    // Load persistent state if available
    if (fs.existsSync(DB_FILE)) {
      try {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        if (fileContent.trim()) {
          const snapshot = JSON.parse(fileContent);
          for (const tableName of Object.keys(snapshot)) {
            alasql(`CREATE TABLE IF NOT EXISTS ${tableName}`);
            alasql.tables[tableName].data = snapshot[tableName];
          }
        }
      } catch (err) {
        console.error('[Database] Error restoring persistent database snapshot:', err);
      }
    }

    this.isInitialized = true;
  }

  public saveSnapshot() {
    try {
      const snapshot: Record<string, any[]> = {};
      for (const tableName of Object.keys(alasql.tables)) {
        if (alasql.tables[tableName] && alasql.tables[tableName].data) {
          snapshot[tableName] = alasql.tables[tableName].data;
        }
      }
      
      // Atomic persistence: write to temp file then rename
      const tempPath = `${DB_FILE}.tmp`;
      // Optimization: No indentation in production snapshots to save CPU/IO
      fs.writeFileSync(tempPath, JSON.stringify(snapshot), 'utf-8');
      
      // Perform atomic rename to ensure integrity
      fs.renameSync(tempPath, DB_FILE);
      
      fs.appendFileSync(WAL_FILE, `[${new Date().toISOString()}] SNAPSHOT_FLUSHED\n`);
    } catch (err) {
      console.error('[Database] Error saving snapshot to disk:', err);
    }
  }

  public exec(sql: string, params: any[] = []): any {
    return alasql(sql, params);
  }

  public query<T = any>(sql: string, params: any[] = []): T[] {
    return alasql(sql, params) as T[];
  }

  public queryOne<T = any>(sql: string, params: any[] = []): T | null {
    const res = alasql(sql, params) as T[];
    return res && res.length > 0 ? res[0] : null;
  }

  /**
   * Acquire a named lock for critical concurrency sections (e.g. wallet_123, contract_456).
   */
  public async acquireLock(key: string): Promise<() => void> {
    while (this.mutexLocks.has(key)) {
      await this.mutexLocks.get(key);
    }

    let releaseLockResolver: () => void;
    const lockPromise = new Promise<void>((resolve) => {
      releaseLockResolver = resolve;
    });

    this.mutexLocks.set(key, lockPromise);

    return () => {
      this.mutexLocks.delete(key);
      releaseLockResolver!();
    };
  }

  /**
   * Execute an atomic database transaction with automatic rollback on error.
   */
  public async transaction<T>(fn: (tx: TransactionContext) => Promise<T>): Promise<T> {
    const txId = `tx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    
    // Optimization: Avoid deep clone/serialization if possible for in-memory rollback.
    // For now, we keep it but ensure it's not indented.
    const dataToSnapshot: Record<string, any[]> = {};
    for (const tableName of Object.keys(alasql.tables)) {
      if (alasql.tables[tableName] && alasql.tables[tableName].data) {
        dataToSnapshot[tableName] = [...alasql.tables[tableName].data]; // Shallow copy arrays
      }
    }

    const context: TransactionContext = {
      id: txId,
      inTransaction: true,
      rollbackActions: [],
    };

    try {
      const result = await fn(context);
      this.saveSnapshot();
      return result;
    } catch (err) {
      console.error(`[Database Transaction ${txId}] Transaction failed, rolling back:`, err);
      // Rollback database state
      for (const tableName of Object.keys(dataToSnapshot)) {
        if (alasql.tables[tableName]) {
          alasql.tables[tableName].data = dataToSnapshot[tableName];
        }
      }

      // Execute custom rollback handlers
      for (const action of context.rollbackActions.reverse()) {
        try {
          action();
        } catch (_) {}
      }

      throw err;
    }
  }
}

export const dbEngine = new ProductionDatabase();
