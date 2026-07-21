import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import configKeys from '../../configKeys';

/**
 * Verifies a valid JWT AND that the caller is an admin.
 *
 * The admin `auth` login (POST /auth/login) issues tokens with role 'admin'.
 * (Legacy tokens may carry 'administrator' — accepted too.) Unlike
 * `userAuthMiddleware`, which only checks that *some* valid token exists, this
 * guard enforces the admin role, so non-admin tokens are rejected.
 */
export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer')) {
    return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
  }
  const token = header.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
  }
  try {
    const decoded = jwt.verify(token, configKeys.JWT_SECRET) as { role?: string };
    if (decoded.role !== 'admin' && decoded.role !== 'administrator') {
      return res.status(403).json({ success: false, message: 'Admin access required.' });
    }
    (req as unknown as { user: unknown }).user = decoded;
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};
