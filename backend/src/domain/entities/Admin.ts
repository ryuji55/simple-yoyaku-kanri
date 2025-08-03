import { User } from './User'
import { Email } from '../valueObjects/Email'
import { Password } from '../valueObjects/Password'

export class Admin extends User {
  constructor(
    id: string,
    email: Email,
    password: Password,
    isActive: boolean,
    createdAt: Date,
    updatedAt: Date
  ) {
    super(id, email, password, 'admin', isActive, createdAt, updatedAt)
  }

  static createNew(email: string, password: string): Admin {
    return new Admin(
      '',
      new Email(email),
      new Password(password),
      true,
      new Date(),
      new Date()
    )
  }
}