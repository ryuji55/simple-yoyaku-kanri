import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { env } from '../config/env.validation';
import type { JwtPayload } from '../types';

export class AuthService {
  private readonly bcryptSaltRounds = 10;

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.bcryptSaltRounds);
  }

  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  generateToken(payload: JwtPayload): string {
    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN as any,
    });
  }

  verifyToken(token: string): JwtPayload {
    return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
  }
}
