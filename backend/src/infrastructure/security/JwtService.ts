import jwt from 'jsonwebtoken'
import { config } from '../../config/env'

export interface JwtPayload {
  id: string
  role: string
  storeId?: string
}

export class JwtService {
  generateToken(payload: JwtPayload): string {
    const expiresIn = config.jwt.expiresIn
    return jwt.sign(payload, config.jwt.secret, {
      expiresIn
    } as jwt.SignOptions)
  }

  verifyToken(token: string): JwtPayload {
    return jwt.verify(token, config.jwt.secret) as JwtPayload
  }
}