/**
 * Production Database Migration Runner and Idempotent Seeder.
 */

import { dbEngine } from './database.ts';
import { CREATE_TABLES_SQL } from './schema.ts';
import { db as legacyDb } from '../db.ts';

export class MigrationRunner {
  public static async runMigrations() {
    await dbEngine.initialize();

    // Execute schema creation statements
    const statements = CREATE_TABLES_SQL.split(';')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    for (const stmt of statements) {
      try {
        dbEngine.exec(stmt);
      } catch (err) {
        console.error('[Migration] Statement execution error:', err, 'Statement:', stmt);
      }
    }

    // Seed data if database is fresh
    await this.seedInitialData();
  }

  private static async seedInitialData() {
    // Check if users table has data
    const existingUsers = dbEngine.query('SELECT COUNT(*) as [count] FROM users');
    if (existingUsers && existingUsers[0] && existingUsers[0].count > 0) {
      return; // Already seeded
    }

    console.log('[Migration] Seeding initial database records from authoritative seed engine...');
    const start = Date.now();

    await dbEngine.transaction(async () => {
      // 1. Seed Users
      console.log(`[Migration] Seeding ${legacyDb.users.length} users...`);
      for (const u of legacyDb.users as any[]) {
        dbEngine.exec(
          `INSERT INTO users (id, email, username, name, avatar, title, bio, country, hourly_rate, rating, review_count, total_earned_cents, total_spent_cents, active_mode, role, status, verification_status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            u.id,
            u.email,
            u.username,
            u.name,
            u.avatar || '',
            u.title || '',
            u.bio || '',
            u.country || 'United States',
            u.hourlyRate || 50,
            u.rating || 5.0,
            u.reviewCount || 0,
            Math.round((u.totalEarned || 0) * 100),
            Math.round((u.totalSpent || 0) * 100),
            u.activeMode || 'CLIENT',
            u.id === 'usr-admin' ? 'SUPER_ADMIN' : (u.activeMode === 'ADMIN' ? 'ADMIN' : 'USER'),
            u.status || 'ACTIVE',
            u.verificationStatus || 'VERIFIED',
            u.createdAt || new Date().toISOString(),
            new Date().toISOString(),
          ]
        );

        if (u.skills && u.skills.length > 0) {
          for (const s of u.skills) {
            dbEngine.exec('INSERT INTO user_skills (user_id, skill) VALUES (?, ?)', [u.id, s]);
          }
        }
      }

      // 2. Seed Wallets
      console.log(`[Migration] Seeding ${legacyDb.wallets.size} wallets...`);
      for (const [userId, w] of legacyDb.wallets.entries() as any) {
        dbEngine.exec(
          `INSERT INTO wallets (id, user_id, currency, available_cents, escrow_cents, protection_period_cents, pending_withdrawal_cents, withdrawn_total_cents, lifetime_earnings_cents, lifetime_spent_cents, last_reconciled_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            w.id || `wal-${userId}`,
            userId,
            'USD',
            Math.round((w.availableBalance || 0) * 100),
            Math.round((w.escrowLockedBalance || 0) * 100),
            Math.round((w.protectionPeriodBalance || 0) * 100),
            Math.round((w.pendingWithdrawal || 0) * 100),
            Math.round((w.withdrawnTotal || 0) * 100),
            Math.round((w.lifetimeEarnings || 0) * 100),
            Math.round((w.lifetimeSpent || 0) * 100),
            w.lastReconciledAt || new Date().toISOString(),
            new Date().toISOString(),
            new Date().toISOString(),
          ]
        );
      }

      // 3. Seed Projects
      console.log(`[Migration] Seeding ${legacyDb.projects.length} projects...`);
      for (const p of legacyDb.projects as any[]) {
        dbEngine.exec(
          `INSERT INTO projects (id, slug, client_id, title, description, category, subcategory, budget_cents, currency, pricing_model, experience_level, duration, proposals_count, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            p.id,
            p.slug,
            p.clientId,
            p.title,
            p.description,
            p.category,
            p.subcategory || p.category,
            Math.round(p.budget * 100),
            'USD',
            p.pricingModel || 'FIXED',
            p.experienceLevel || 'INTERMEDIATE',
            p.duration || '1 to 3 months',
            p.proposalsCount || 0,
            p.status || 'PUBLISHED',
            p.createdAt || new Date().toISOString(),
            p.updatedAt || new Date().toISOString(),
          ]
        );

        if (p.skills && p.skills.length > 0) {
          for (const s of p.skills) {
            dbEngine.exec('INSERT INTO project_skills (project_id, skill) VALUES (?, ?)', [p.id, s]);
          }
        }
      }

      // 4. Seed Offers
      console.log(`[Migration] Seeding ${legacyDb.offers.length} offers...`);
      for (const o of legacyDb.offers as any[]) {
        dbEngine.exec(
          `INSERT INTO offers (id, slug, freelancer_id, title, description, category, subcategory, starting_price_cents, currency, orders_in_queue, rating, review_count, status, featured, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            o.id,
            o.slug,
            o.freelancerId,
            o.title,
            o.description,
            o.category,
            o.subcategory || o.category,
            Math.round((o.packages?.basic?.price || 100) * 100),
            'USD',
            o.ordersInQueue || 0,
            o.rating || 5.0,
            o.reviewCount || 0,
            o.status || 'ACTIVE',
            o.featured ? 1 : 0,
            o.createdAt || new Date().toISOString(),
            o.updatedAt || new Date().toISOString(),
          ]
        );

        if (o.skills && o.skills.length > 0) {
          for (const s of o.skills) {
            dbEngine.exec('INSERT INTO offer_skills (offer_id, skill) VALUES (?, ?)', [o.id, s]);
          }
        }
      }

      // 5. Seed Contracts & Milestones
      console.log(`[Migration] Seeding ${legacyDb.contracts.length} contracts...`);
      for (const c of legacyDb.contracts as any[]) {
        dbEngine.exec(
          `INSERT INTO contracts (id, title, project_id, proposal_id, client_id, freelancer_id, total_amount_cents, currency, escrow_amount_cents, status, start_date, end_date, auto_released, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            c.id,
            c.title,
            c.projectId,
            c.proposalId || '',
            c.clientId,
            c.freelancerId,
            Math.round(c.totalAmount * 100),
            'USD',
            Math.round((c.escrowAmount || 0) * 100),
            c.status,
            c.startDate || new Date().toISOString(),
            c.endDate || '',
            c.autoReleased ? 1 : 0,
            c.createdAt || new Date().toISOString(),
            c.updatedAt || new Date().toISOString(),
          ]
        );

        if (c.milestones && c.milestones.length > 0) {
          for (const m of c.milestones) {
            dbEngine.exec(
              `INSERT INTO contract_milestones (id, contract_id, title, description, amount_cents, currency, due_date, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                m.id,
                c.id,
                m.title,
                m.description,
                Math.round(m.amount * 100),
                'USD',
                m.dueDate || '',
                m.status,
                new Date().toISOString(),
                new Date().toISOString(),
              ]
            );
          }
        }
      }

      // 6. Seed Categories
      console.log(`[Migration] Seeding ${legacyDb.categories.length} categories...`);
      for (const cat of legacyDb.categories) {
        dbEngine.exec(
          `INSERT INTO categories (id, name, slug, description, icon, active, created_at) VALUES (?, ?, ?, ?, ?, 1, ?)`,
          [cat.id, cat.name, cat.slug, cat.description, cat.icon, new Date().toISOString()]
        );

        if (cat.subcategories) {
          for (const sub of cat.subcategories) {
            dbEngine.exec(
              `INSERT INTO subcategories (id, category_id, name, slug, job_count, active) VALUES (?, ?, ?, ?, ?, 1)`,
              [`sub-${sub.slug}`, cat.id, sub.name, sub.slug, sub.jobCount || 0]
            );
          }
        }
      }

      // 7. Seed Settings
      dbEngine.exec(`INSERT INTO marketplace_settings ([key], [value]) VALUES ('settings', ?)`, [
        JSON.stringify(legacyDb.settings),
      ]);
    });

    const duration = Date.now() - start;
    console.log(`[Migration] Database migration and seeding completed successfully in ${duration}ms!`);
  }
}
