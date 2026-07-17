import { NextFunction, Request, Response } from 'express';
import logger from '../config/logger';
import AppError from '../common/appError';

const errorHandleMiddleware = (err: AppError, req: Request, res: Response, next: NextFunction) => {
  logger.error(err);
  err.statusCode = err.statusCode || 500;
  if (err.statusCode === 404) {
    res.status(err.statusCode).json({
      success: err.success === true,
      message: err.message,
    });
  } else {
    res.status(err.statusCode).json({
      success: err.success === true,
      message: err.message,
    });
  }
  next();
};

export default errorHandleMiddleware;
