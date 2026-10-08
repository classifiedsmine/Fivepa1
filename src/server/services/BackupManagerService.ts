/**
 * Production Backup and Point-in-Time Recovery Manager.
 */

import fs from 'fs';
import path from 'path';
import { dbEngine } from '../db/database.ts';

const BACKUPS_DIR = path.resolve(process.cwd(), '.data/backups');

export class BackupManagerService {
  /**
   * Create an automated point-in-time database snapshot backup.
   */
  public static async createBackup(): Promise<{ backupId: string; filePath: string; sizeBytes: number; timestamp: string }> {
    if (!fs.existsSync(BACKUPS_DIR)) {
      fs.mkdirSync(BACKUPS_DIR, { recursive: true });
    }

    const timestamp = new Date().toISOString();
    const backupId = `bkp_${Date.now()}`;
    const filePath = path.join(BACKUPS_DIR, `${backupId}.json`);

    dbEngine.saveSnapshot();

    const dbFile = path.resolve(process.cwd(), '.data/worksphere_production.json');
    if (fs.existsSync(dbFile)) {
      fs.copyFileSync(dbFile, filePath);
    }

    const stats = fs.statSync(filePath);

    return {
      backupId,
      filePath,
      sizeBytes: stats.size,
      timestamp,
    };
  }

  /**
   * List all available backups.
   */
  public static listBackups() {
    if (!fs.existsSync(BACKUPS_DIR)) return [];

    const files = fs.readdirSync(BACKUPS_DIR);
    return files.map((f) => {
      const p = path.join(BACKUPS_DIR, f);
      const stats = fs.statSync(p);
      return {
        backupId: f.replace('.json', ''),
        fileName: f,
        sizeBytes: stats.size,
        createdAt: stats.birthtime.toISOString(),
      };
    });
  }
}
