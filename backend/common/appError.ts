import { HttpStatus } from './httpStatus';

class AppError extends Error {
  statusCode: number;
  success: boolean;
  isOperational: boolean;
  constructor(message: string, statusCode: HttpStatus) {
    super(message);
    this.statusCode = statusCode;
    this.success = false;
    this.message = message;
    Error.captureStackTrace(this, this.constructor);
    this.isOperational = true;
  }
}

export default AppError;
