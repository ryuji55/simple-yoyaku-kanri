import { Email } from '../valueObjects/Email'
import { Password } from '../valueObjects/Password'

export type UserRole = 'admin' | 'store' | 'customer'

export interface IUser {
  id: string
  email: Email
  password: Password
  role: UserRole
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export class User implements IUser {
  constructor(
    public readonly id: string,
    public readonly email: Email,
    public readonly password: Password,
    public readonly role: UserRole,
    public readonly isActive: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  static create(params: {
    email: string
    password: string
    role: UserRole
  }): Omit<User, 'id' | 'createdAt' | 'updatedAt'> {
    return new User(
      '', // IDは永続化時に設定
      new Email(params.email),
      new Password(params.password),
      params.role,
      true,
      new Date(),
      new Date()
    )
  }

  canLogin(): boolean {
    return this.isActive
  }
}