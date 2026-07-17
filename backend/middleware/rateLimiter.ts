import rateLimit from 'express-rate-limit';
import { Request } from 'express';
import configKeys from '../configKeys';

// Create a rate limiter specifically for login attempts
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: configKeys.LOGIN_LIMIT,
  message: {
    error: 'Too many login attempts, please try again later',
  },
  standardHeaders: true, // Return rate limit info in RateLimit-* headers
  legacyHeaders: false, // Disable X-RateLimit-* headers

  // Optional: Track attempts by user email instead of IP
  keyGenerator: (req: Request) => {
    return req.body.email || req.ip;
  },
});

// Create a rate limiter specifically for fetchXML attempts
export const fetchXMLLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // Limit each IP to 3
  message: {
    error: 'Too many fetch attempts, please try again later',
  },
  standardHeaders: true, // Return rate limit info in RateLimit-* headers
  legacyHeaders: false, // Disable X-RateLimit-* headers

  // Optional: Track attempts by user email instead of IP
  keyGenerator: (req: Request) => {
    return req.body.email || req.ip;
  },
});
