import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

export const generateToken = (payload: any): string => {
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d'
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn
  } as jwt.SignOptions)
}

export const verifyToken = (token: string): any => {
  return jwt.verify(token, process.env.JWT_SECRET!)
}

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 10)
}

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash)
}