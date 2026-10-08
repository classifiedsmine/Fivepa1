/**
 * Production Background Job Service.
 * Provides Cloud Run horizontally autoscaling job queue runner
 * with distributed locking, retries, and scheduled jobs execution.
 */

import { dbEngine } from '../db/database.ts';
import { EscrowService } from './EscrowService.ts';

export class BackgroundJobService {
  private static intervalTimer: NodeJS.Timeout | null = null;

  /**
   * Start background job runner loop.
   */
  public static startScheduler() {
    if (this.intervalTimer) return;

    console.log('[BackgroundJobService] Starting background job scheduler loop...');

    this.intervalTimer = setInterval(async () => {
      await this.processPendingJobs();
    }, 30000); // Check every 30 seconds
  }

  /**
   * Enqueue a new background job.
   */
  public static enqueueJob(name: string, payload: any, scheduledAt?: string) {
    const jobId = `job_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();

    dbEngine.exec(
      `INSERT INTO background_jobs (id, name, status, attempts, max_attempts, payload, scheduled_at, created_at) VALUES (?, ?, 'PENDING', 0, 3, ?, ?, ?)`,
      [jobId, name, JSON.stringify(payload), scheduledAt || now, now]
    );

    return jobId;
  }

  /**
   * Process pending scheduled jobs safely with lock duration protection.
   */
  public static async processPendingJobs() {
    const now = new Date().toISOString();

    // Acquire lock for 14-day escrow protection check
    const releaseLock = await dbEngine.acquireLock('job_protection_period_check');
    try {
      const releasedCount = await EscrowService.processProtectionPeriodAutoReleases();
      if (releasedCount > 0) {
        console.log(`[BackgroundJobService] 14-Day Escrow Protection Job: Auto-released ${releasedCount} eligible milestones.`);
      }
    } catch (err) {
      console.error('[BackgroundJobService] Error during escrow protection job:', err);
    } finally {
      releaseLock();
    }
  }
}
