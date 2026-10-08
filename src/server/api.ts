/**
 * Production Authoritative REST API Router for WorkSphere Freelance Marketplace.
 * Connected to Persistent SQL Database, Domain Services, Double-Entry Ledger,
 * and Granular RBAC Permission Middleware.
 */

import { Router, Request, Response } from 'express';
import { dbEngine } from './db/database.ts';
import { requireAdminPermission, authenticateUser, AuthenticatedRequest } from './middleware/auth.ts';
import { WalletService } from './services/WalletService.ts';
import { LedgerService } from './services/LedgerService.ts';
import { EscrowService } from './services/EscrowService.ts';
import { WithdrawalService } from './services/WithdrawalService.ts';
import { PaymentService } from './services/PaymentService.ts';
import { DisputeService } from './services/DisputeService.ts';
import { ReconciliationService } from './services/ReconciliationService.ts';
import { BackupManagerService } from './services/BackupManagerService.ts';
import { FileStorageService } from './services/FileStorageService.ts';

const router = Router();

// ----------------- AUTH & UNIFIED IDENTITY -----------------

/**
 * Helper to map backend internal WalletRecord (cents) to frontend expected Wallet (dollars).
 */
const mapWalletToFrontend = (w: any) => ({
  userId: w.userId,
  availableBalance: (w.availableCents || 0) / 100,
  escrowLockedBalance: (w.escrowCents || 0) / 100,
  protectionPeriodBalance: (w.protectionPeriodCents || 0) / 100,
  pendingWithdrawalBalance: (w.pendingWithdrawalCents || 0) / 100,
  withdrawnTotal: (w.withdrawnTotalCents || 0) / 100,
  lifetimeEarnings: (w.lifetimeEarningsCents || 0) / 100,
  lifetimeSpent: (w.lifetimeSpentCents || 0) / 100,
  currency: w.currency || 'USD',
  lastReconciledAt: w.lastReconciledAt,
});

const mapLedgerToFrontend = (l: any) => ({
  id: l.id,
  idempotencyKey: l.idempotencyKey || l.idempotency_key,
  userId: l.userId || l.user_id,
  type: l.type,
  entryType: l.entryType || l.entry_type,
  amount: (l.amountCents || l.amount_cents || 0) / 100,
  balanceAfter: (l.balanceAfterCents || l.balance_after_cents || 0) / 100,
  currency: l.currency || 'USD',
  description: l.description,
  referenceType: l.referenceType || l.reference_type,
  referenceId: l.referenceId || l.reference_id,
  createdAt: l.createdAt || l.created_at,
});

router.get('/auth/users', (req: Request, res: Response) => {
  // Allow discovery of users for marketplace but omit sensitive financial data
  const users = dbEngine.query('SELECT id, name, username, email, avatar, title, bio, country, hourly_rate, rating, review_count, active_mode, status, verification_status, created_at FROM users WHERE deleted_at IS NULL ORDER BY created_at DESC');
  res.json({ users });
});

router.get('/auth/user/:id', authenticateUser, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const user = dbEngine.queryOne('SELECT * FROM users WHERE id = ? AND deleted_at IS NULL', [id]);
  if (!user) return res.status(404).json({ error: 'User not found' });

  // Privacy Guard: Only self or admin can see full profile + wallet
  const isSelf = req.user?.id === id;
  const isAdmin = req.user?.role === 'ADMIN' || req.user?.role === 'SUPER_ADMIN';

  if (!isSelf && !isAdmin) {
    // Return redacted profile for public view
    const { id: _, ...redactedUser } = user; // keep ID but redact private fields if needed in a real app
    // For now, just return specific public fields
    return res.json({ 
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        avatar: user.avatar,
        title: user.title,
        bio: user.bio,
        country: user.country,
        rating: user.rating,
        review_count: user.review_count,
        active_mode: user.active_mode,
        verification_status: user.verification_status
      }
    });
  }

  const wallet = await WalletService.getOrCreateWallet(user.id);
  res.json({ user, wallet: mapWalletToFrontend(wallet) });
});

router.post('/auth/switch-mode', authenticateUser, (req: AuthenticatedRequest, res: Response) => {
  const { userId, mode } = req.body;
  const authenticatedId = req.user?.id;

  // Identity Guard: Cannot switch mode for another user
  if (userId !== authenticatedId && req.user?.role !== 'SUPER_ADMIN') {
    return res.status(403).json({ error: 'Forbidden: Cannot modify another user account.' });
  }

  const user = dbEngine.queryOne<any>('SELECT * FROM users WHERE id = ?', [userId]);
  if (!user) return res.status(404).json({ error: 'User not found' });
  if (!['CLIENT', 'FREELANCER', 'ADMIN'].includes(mode)) {
    return res.status(400).json({ error: 'Invalid mode' });
  }
  
  const previousMode = user.active_mode;
  const now = new Date().toISOString();
  dbEngine.exec('UPDATE users SET active_mode = ?, updated_at = ? WHERE id = ?', [mode, now, userId]);

  // Record audit log
  const actor = req.user!;
  dbEngine.exec(
    `INSERT INTO admin_audit_logs (id, actor_id, actor_name, actor_role, action, category, entity_type, entity_id, previous_state, new_state, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      `audit_${Date.now()}`,
      actor.id,
      actor.name,
      actor.role,
      'SWITCH_MODE',
      'USER_MANAGEMENT',
      'USER',
      userId,
      JSON.stringify({ mode: previousMode }),
      JSON.stringify({ mode: mode }),
      now
    ]
  );

  res.json({ success: true, mode });
});

router.post('/auth/verify-kyc', authenticateUser, (req: AuthenticatedRequest, res: Response) => {
  const { userId, status } = req.body;
  const user = dbEngine.queryOne<any>('SELECT * FROM users WHERE id = ?', [userId]);
  if (!user) return res.status(404).json({ error: 'User not found' });
  
  const previousStatus = user.verification_status;
  const kycStatus = status || 'VERIFIED';
  const now = new Date().toISOString();
  dbEngine.exec('UPDATE users SET verification_status = ?, updated_at = ? WHERE id = ?', [kycStatus, now, userId]);

  // Record audit log
  const actor = req.user!;
  dbEngine.exec(
    `INSERT INTO admin_audit_logs (id, actor_id, actor_name, actor_role, action, category, entity_type, entity_id, previous_state, new_state, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      `audit_${Date.now()}`,
      actor.id,
      actor.name,
      actor.role,
      'VERIFY_KYC',
      'USER_MANAGEMENT',
      'USER',
      userId,
      JSON.stringify({ status: previousStatus }),
      JSON.stringify({ status: kycStatus }),
      now
    ]
  );

  res.json({ success: true, verificationStatus: kycStatus });
});

// ----------------- MARKETPLACE DISCOVERY -----------------
router.get('/marketplace/categories', (req: Request, res: Response) => {
  const categories = dbEngine.query('SELECT * FROM categories WHERE active = 1');
  const subcategories = dbEngine.query('SELECT * FROM subcategories WHERE active = 1');

  const result = categories.map((c: any) => ({
    ...c,
    subcategories: subcategories.filter((s: any) => s.category_id === c.id),
  }));

  res.json({ categories: result });
});

router.get('/marketplace/projects', (req: Request, res: Response) => {
  const { category, search, experience, pricingModel } = req.query;
  let projects = dbEngine.query('SELECT * FROM projects WHERE deleted_at IS NULL ORDER BY created_at DESC');

  if (category && category !== 'all') {
    const q = String(category).toLowerCase();
    projects = projects.filter((p: any) => (p.category || '').toLowerCase().includes(q));
  }
  if (search) {
    const q = String(search).toLowerCase();
    projects = projects.filter(
      (p: any) => (p.title || '').toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q)
    );
  }

  res.json({ projects });
});

router.get('/marketplace/projects/:slugOrId', (req: Request, res: Response) => {
  const p = dbEngine.queryOne('SELECT * FROM projects WHERE (slug = ? OR id = ?) AND deleted_at IS NULL', [
    req.params.slugOrId,
    req.params.slugOrId,
  ]);
  if (!p) return res.status(404).json({ error: 'Project not found' });
  const proposals = dbEngine.query('SELECT * FROM proposals WHERE project_id = ?', [p.id]);
  res.json({ project: p, proposals });
});

router.post('/marketplace/projects', (req: Request, res: Response) => {
  const { clientId, title, description, category, subcategory, skills, budget, pricingModel, experienceLevel, duration } =
    req.body;
  const client = dbEngine.queryOne('SELECT * FROM users WHERE id = ?', [clientId]);
  if (!client) return res.status(400).json({ error: 'Invalid client' });

  const id = `prj-${Date.now()}`;
  const slug =
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') +
    '-' +
    Math.floor(Math.random() * 1000);
  const now = new Date().toISOString();

  dbEngine.exec(
    `INSERT INTO projects (id, slug, client_id, title, description, category, subcategory, budget_cents, currency, pricing_model, experience_level, duration, proposals_count, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'USD', ?, ?, ?, 0, 'PUBLISHED', ?, ?)`,
    [
      id,
      slug,
      clientId,
      title,
      description,
      category,
      subcategory || category,
      Math.round(Number(budget) * 100),
      pricingModel || 'FIXED',
      experienceLevel || 'INTERMEDIATE',
      duration || '1 to 3 months',
      now,
      now,
    ]
  );

  const newProject = dbEngine.queryOne('SELECT * FROM projects WHERE id = ?', [id]);
  res.json({ success: true, project: newProject });
});

router.get('/marketplace/offers', (req: Request, res: Response) => {
  const offers = dbEngine.query('SELECT * FROM offers WHERE deleted_at IS NULL ORDER BY created_at DESC');
  res.json({ offers });
});

router.get('/marketplace/offers/:slugOrId', (req: Request, res: Response) => {
  const offer = dbEngine.queryOne('SELECT * FROM offers WHERE (slug = ? OR id = ?) AND deleted_at IS NULL', [
    req.params.slugOrId,
    req.params.slugOrId,
  ]);
  if (!offer) return res.status(404).json({ error: 'Offer not found' });
  res.json({ offer });
});

// ----------------- FINANCIAL & ESCROW ENDPOINTS -----------------
router.post('/payments/deposit', authenticateUser, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { amount, provider } = req.body;
    const userId = req.user!.id; // Authoritative Identity
    const amountCents = Math.round(Number(amount) * 100);
    
    if (isNaN(amountCents) || amountCents <= 0) {
      return res.status(400).json({ error: 'Invalid deposit amount.' });
    }

    const eventId = `dep_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    const result = await PaymentService.handleVerifiedWebhook({
      provider: provider || 'RAZORPAY',
      eventId,
      eventType: 'manual.deposit',
      userId,
      amountCents,
      currency: 'USD',
      rawPayload: { manualDeposit: true },
    });

    const wallet = await WalletService.getOrCreateWallet(userId);
    res.json({ ...result, wallet: mapWalletToFrontend(wallet) });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/withdrawals/request', authenticateUser, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { amount, paymentMethod, accountDetails, idempotencyKey } = req.body;
    const userId = req.user!.id; // Authoritative Identity
    const amountCents = Math.round(Number(amount) * 100);

    if (isNaN(amountCents) || amountCents <= 0) {
      return res.status(400).json({ error: 'Invalid withdrawal amount.' });
    }

    const result = await WithdrawalService.requestWithdrawal({
      idempotencyKey: idempotencyKey || `wdr_key_${Date.now()}`,
      userId,
      amountCents,
      paymentMethod: paymentMethod || 'Bank Wire',
      accountDetails: accountDetails || 'Primary Bank Account',
    });

    res.json({ withdrawal: result });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/contracts/:contractId/milestones/:milestoneId/release', authenticateUser, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { contractId, milestoneId } = req.params;
    const userId = req.user!.id; // Authoritative Identity

    const result = await EscrowService.releaseMilestoneEscrow(contractId, milestoneId, userId);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// ----------------- ADMIN RBAC ENDPOINTS -----------------
router.get('/admin/kpis', requireAdminPermission('users.view'), (req: Request, res: Response) => {
  const usersCount = dbEngine.queryOne<any>('SELECT COUNT(*) as cnt FROM users WHERE deleted_at IS NULL')!.cnt;
  const projectsCount = dbEngine.queryOne<any>('SELECT COUNT(*) as cnt FROM projects WHERE deleted_at IS NULL')!.cnt;
  const contractsCount = dbEngine.queryOne<any>('SELECT COUNT(*) as cnt FROM contracts')!.cnt;
  const disputesCount = dbEngine.queryOne<any>('SELECT COUNT(*) as cnt FROM disputes')!.cnt;

  res.json({
    kpis: {
      totalUsers: usersCount,
      totalProjects: projectsCount,
      totalContracts: contractsCount,
      activeDisputes: disputesCount,
      systemHealth: 'OPERATIONAL',
    },
  });
});

router.get('/admin/audit-logs', requireAdminPermission('audit_logs.view'), (req: Request, res: Response) => {
  const logs = dbEngine.query('SELECT * FROM admin_audit_logs ORDER BY created_at DESC LIMIT 100');
  res.json({ logs });
});

router.get('/admin/reconciliation', requireAdminPermission('payments.view'), async (req: Request, res: Response) => {
  const report = await ReconciliationService.runReconciliationAudit();
  res.json(report);
});

router.get('/admin/backups', requireAdminPermission('system.maintenance'), (req: Request, res: Response) => {
  const backups = BackupManagerService.listBackups();
  res.json({ backups });
});

router.post('/admin/backups/create', requireAdminPermission('system.maintenance'), async (req: Request, res: Response) => {
  const backup = await BackupManagerService.createBackup();
  res.json({ success: true, backup });
});

router.post('/admin/impersonate', requireAdminPermission('users.edit'), (req: AuthenticatedRequest, res: Response) => {
  const { targetUserId } = req.body;
  const targetUser = dbEngine.queryOne('SELECT * FROM users WHERE id = ?', [targetUserId]);
  if (!targetUser) return res.status(404).json({ error: 'Target user not found' });
  
  // Log the action
  const actor = req.user!;
  dbEngine.exec(
    `INSERT INTO admin_audit_logs (id, actor_id, actor_name, actor_role, action, category, entity_type, entity_id, new_state, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [`audit_imp_${Date.now()}`, actor.id, actor.name, actor.role, 'IMPERSONATE_USER', 'USER_MANAGEMENT', 'USER', targetUserId, JSON.stringify({ target: targetUser.email }), new Date().toISOString()]
  );

  res.json({ success: true, user: targetUser });
});

// ----------------- NOTIFICATIONS -----------------
router.get('/notifications/:userId', authenticateUser, (req: AuthenticatedRequest, res: Response) => {
  const { userId } = req.params;
  const authenticatedId = req.user?.id;

  // IDOR Guard
  if (userId !== authenticatedId && req.user?.role !== 'ADMIN' && req.user?.role !== 'SUPER_ADMIN') {
    return res.status(403).json({ error: 'Forbidden: Cannot access another user\'s notifications.' });
  }

  const notifications = dbEngine.query('SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50', [userId]);
  res.json({ notifications });
});

router.patch('/notifications/:id/read', authenticateUser, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.id;

  // Ownership Guard
  const notification = dbEngine.queryOne('SELECT * FROM notifications WHERE id = ?', [id]);
  if (!notification) return res.status(404).json({ error: 'Notification not found' });
  
  if (notification.user_id !== userId && req.user?.role !== 'SUPER_ADMIN') {
    return res.status(403).json({ error: 'Forbidden: Cannot modify another user\'s notifications.' });
  }

  dbEngine.exec('UPDATE notifications SET read = 1 WHERE id = ?', [id]);
  res.json({ success: true });
});

// ----------------- WALLET ALIASES -----------------
router.get('/wallet/:userId', authenticateUser, async (req: AuthenticatedRequest, res: Response) => {
  const { userId } = req.params;
  const authenticatedId = req.user?.id;

  // IDOR Guard
  if (userId !== authenticatedId && req.user?.role !== 'ADMIN' && req.user?.role !== 'SUPER_ADMIN') {
    return res.status(403).json({ error: 'Forbidden: Cannot access another user\'s wallet.' });
  }

  const wallet = await WalletService.getOrCreateWallet(userId);
  const ledger = LedgerService.getLedgerForUser(userId);
  const withdrawals = dbEngine.query('SELECT * FROM withdrawal_requests WHERE user_id = ? ORDER BY created_at DESC', [userId]);

  res.json({
    wallet: mapWalletToFrontend(wallet),
    ledger: ledger.map(mapLedgerToFrontend),
    withdrawals: withdrawals.map((w: any) => ({
      id: w.id,
      userId: w.user_id,
      amount: (w.amount_cents || 0) / 100,
      status: w.status,
      method: w.payment_method,
      requestedAt: w.created_at,
      processedAt: w.processed_at,
    })),
  });
});

router.post('/wallet/deposit', authenticateUser, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { amount, provider } = req.body;
    const userId = req.user!.id; // Authoritative Identity
    const amountCents = Math.round(Number(amount) * 100);

    if (isNaN(amountCents) || amountCents <= 0) {
      return res.status(400).json({ error: 'Invalid deposit amount.' });
    }

    const eventId = `dep_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    const result = await PaymentService.handleVerifiedWebhook({
      provider: provider || 'RAZORPAY',
      eventId,
      eventType: 'manual.deposit',
      userId,
      amountCents,
      currency: 'USD',
      rawPayload: { manualDeposit: true },
    });

    const wallet = await WalletService.getOrCreateWallet(userId);
    res.json({ ...result, wallet: mapWalletToFrontend(wallet) });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/wallet/withdraw', authenticateUser, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { amount, paymentMethod, accountDetails, idempotencyKey } = req.body;
    const userId = req.user!.id; // Authoritative Identity
    const amountCents = Math.round(Number(amount) * 100);

    if (isNaN(amountCents) || amountCents <= 0) {
      return res.status(400).json({ error: 'Invalid withdrawal amount.' });
    }

    const result = await WithdrawalService.requestWithdrawal({
      idempotencyKey: idempotencyKey || `wdr_key_${Date.now()}`,
      userId,
      amountCents,
      paymentMethod: paymentMethod || 'Bank Wire',
      accountDetails: accountDetails || 'Primary Bank Account',
    });

    res.json({ withdrawal: result });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
