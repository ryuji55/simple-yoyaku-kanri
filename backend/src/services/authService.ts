import * as bcrypt from 'bcrypt';
import type { SignOptions } from 'jsonwebtoken';
import * as jwt from 'jsonwebtoken';
import { config } from '../config/env';
import type { JwtPayload } from '../types';

export class AuthService {
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, config.bcryptSaltRounds);
  }

  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  generateToken(payload: JwtPayload): string {
    const options: SignOptions = {
      expiresIn: config.jwtExpiresIn as any,
    };
    return jwt.sign(payload, config.jwtSecret, options);
  }

  verifyToken(token: string): JwtPayload {
    return jwt.verify(token, config.jwtSecret) as JwtPayload;
  }
}
