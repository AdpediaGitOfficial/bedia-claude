import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import configKeys from '../../configKeys';

export const userAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
      const decoded = jwt.verify(token, configKeys.JWT_SECRET);
      (req as any).user = decoded;
      next();
    } catch (error) {
      res.status(400).json({ message: 'Invalid token' });
    }
  } else {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }
};

export const adminAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
      const decoded = jwt.verify(token, configKeys.JWT_SECRET) as { role: string; email: string };
      if (decoded.role !== 'administrator') {
        return res.status(403).json({ message: 'Access denied.' });
      }
      (req as any).user = decoded;
      next();
    } catch (error) {
      res.status(400).json({ message: 'Invalid token' });
    }
  } else {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }
};
