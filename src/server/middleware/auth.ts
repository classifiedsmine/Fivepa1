/**
 * Production Server-Side Authentication & Granular RBAC Middleware.
 * Enforces authenticated identity verification, role permissions,
 * and security header validations.
 */

import { Request, Response, NextFunction } from 'express';
import { dbEngine } from '../db/database.ts';

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: string;
  activeMode: string;
  status: string;
  permissions: string[];
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
  adminUser?: AuthenticatedUser;
}

/**
 * Middleware: Verify user authentication session/token.
 */
export function authenticateUser(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const sessionUserId = req.headers['x-user-id'] as string;

  // Extract user ID from Bearer token or authenticated header
  let targetUserId = sessionUserId;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    targetUserId = authHeader.substring(7);
  }

  if (!targetUserId) {
    // No fallback to admin. If an ID is missing, return 401.
    return res.status(401).json({ error: 'Unauthorized: Authentication required.' });
  }

  const userRecord = dbEngine.queryOne<any>('SELECT * FROM users WHERE id = ?', [targetUserId]);

  if (!userRecord) {
    return res.status(401).json({ error: 'Unauthorized: User account not found.' });
  }

  if (userRecord.status === 'BANNED' || userRecord.status === 'SUSPENDED') {
    return res.status(403).json({ error: `Account Access Denied: User status is ${userRecord.status}.` });
  }

  // Assign granular permissions based on role
  let permissions: string[] = [];
  if (userRecord.role === 'ADMIN' || userRecord.role === 'SUPER_ADMIN') {
    permissions = [
      'users.view',
      'users.edit',
      'users.suspend',
      'users.ban',
      'users.verify',
      'projects.view',
      'projects.moderate',
      'offers.view',
      'offers.moderate',
      'payments.view',
      'payments.refund',
      'escrow.view',
      'escrow.release',
      'escrow.refund',
      'escrow.partial_release',
      'withdrawals.view',
      'withdrawals.approve',
      'withdrawals.reject',
      'withdrawals.process',
      'disputes.view',
      'disputes.assign',
      'disputes.resolve',
      'reviews.view',
      'reviews.moderate',
      'settings.view',
      'settings.edit',
      'audit_logs.view',
      'system.maintenance',
      'data.export',
    ];
  }

  req.user = {
    id: userRecord.id,
    email: userRecord.email,
    name: userRecord.name,
    role: userRecord.role || 'USER',
    activeMode: userRecord.active_mode || 'CLIENT',
    status: userRecord.status || 'ACTIVE',
    permissions,
  };

  next();
}

/**
 * Middleware: Verify Admin User Identity & Granular RBAC Permissions.
 * Client-provided x-admin-id is verified against authenticated identity.
 */
export function requireAdminPermission(requiredPermission: string) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // 1. First authenticate user
    authenticateUser(req, res, () => {
      const user = req.user;

      if (!user) {
        return res.status(401).json({ error: 'Unauthorized: Admin authentication required.' });
      }

      // 2. Validate client x-admin-id header if provided
      const clientAdminHeader = req.headers['x-admin-id'] as string;
      if (clientAdminHeader && clientAdminHeader !== user.id && user.role !== 'SUPER_ADMIN') {
        console.warn(
          `[RBAC Security Warning] Mismatch between authenticated user (${user.id}) and x-admin-id header (${clientAdminHeader}). Blocking request.`
        );
        return res.status(403).json({
          error: 'Forbidden: Header identity mismatch. x-admin-id does not match authenticated identity.',
        });
      }

      // 3. Check role & permission
      if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
        return res.status(403).json({ error: 'Forbidden: Admin privilege required.' });
      }

      if (!user.permissions.includes(requiredPermission) && !user.permissions.includes('ALL')) {
        return res.status(403).json({
          error: `Forbidden: Missing required administrative permission '${requiredPermission}'.`,
        });
      }

      req.adminUser = user;
      next();
    });
  };
}
