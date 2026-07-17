import jwt, { JwtPayload } from 'jsonwebtoken';
import configKeys from '../configKeys';

export function generateToken(payload: { role: string; userId: string }): string {
  const token = jwt.sign(payload, configKeys.JWT_SECRET, {
    expiresIn: '100000d',
  });
  return token;
}

export function generateTokenUser(payload: { role: string; userId: string }): string {
  const token = jwt.sign(payload, configKeys.JWT_SECRET, {
    expiresIn: '1d',
  });
  return token;
}

export function verifyToken(token: string): JwtPayload | string {
  return jwt.verify(token, configKeys.JWT_SECRET);
}
