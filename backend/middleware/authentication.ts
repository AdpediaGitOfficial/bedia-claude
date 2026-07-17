import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../authentication/authentication';
import AppError from '../common/appError';
import { HttpStatus } from '../common/httpStatus';
import { responseMessages } from '../config/localization';
import { JwtPayload } from 'jsonwebtoken';
import logger from '../config/logger';

export function authenticateUser(req: Request, res: Response, next: NextFunction): void {
  // Check for JWT token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    const token = req.headers.authorization.split(' ')[1];
    try {
      const user: JwtPayload | string = verifyToken(token);
      if (!user || typeof user === 'string' || user?.role !== 'user') {
        throw new AppError(responseMessages.invalid_token, HttpStatus.UNAUTHORIZED);
      }
      // Store user data in res.locals for use in other middleware and routes
      res.locals.userId = user.userId as string;
      next();
      return;
    } catch (error) {
      logger.error(error);
      throw new AppError(responseMessages.unauthorized_user, HttpStatus.UNAUTHORIZED);
    }
  }
  // If no JWT token is provided
  throw new AppError(responseMessages.jwt_token_required, HttpStatus.UNAUTHORIZED);
}

export function authenticateAdmin(req: Request, res: Response, next: NextFunction): void {
  // Check for JWT token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    const token = req.headers.authorization.split(' ')[1];
    try {
      const user: JwtPayload | string = verifyToken(token);
      if (!user || typeof user === 'string' || user?.role !== 'admin') {
        throw new AppError(responseMessages.invalid_token, HttpStatus.UNAUTHORIZED);
      }
      // Store user data in res.locals for use in other middleware and routes
      res.locals.userId = user.userId as string;
      next();
      return;
    } catch (error) {
      logger.error(error);
      throw new AppError(responseMessages.unauthorized_user, HttpStatus.UNAUTHORIZED);
    }
  }
  // If no JWT token is provided
  throw new AppError(responseMessages.jwt_token_required, HttpStatus.UNAUTHORIZED);
}
