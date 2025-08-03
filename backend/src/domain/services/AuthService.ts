import bcrypt from 'bcryptjs'
import { Password } from '../valueObjects/Password'

export class AuthService {
  async hashPassword(password: Password): Promise<string> {
    return bcrypt.hash(password.toString(), 10)
  }

  async verifyPassword(password: Password, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password.toString(), hashedPassword)
  }
}