import { User } from './User'
import { Email } from '../valueObjects/Email'
import { Password } from '../valueObjects/Password'
import { Gender } from '../valueObjects/Gender'

export interface ICustomer extends User {
  name: string
  storeId: string
  phone: string
  gender?: Gender
  birthday?: Date
}

export class Customer extends User implements ICustomer {
  constructor(
    id: string,
    email: Email,
    password: Password,
    isActive: boolean,
    createdAt: Date,
    updatedAt: Date,
    public readonly name: string,
    public readonly storeId: string,
    public readonly phone: string,
    public readonly gender?: Gender,
    public readonly birthday?: Date
  ) {
    super(id, email, password, 'customer', isActive, createdAt, updatedAt)
  }

  static createNew(params: {
    email: string
    password: string
    name: string
    storeId: string
    phone: string
    gender?: string
    birthday?: string
  }): Customer {
    return new Customer(
      '',
      new Email(params.email),
      new Password(params.password),
      true,
      new Date(),
      new Date(),
      params.name,
      params.storeId,
      params.phone,
      params.gender ? new Gender(params.gender) : undefined,
      params.birthday ? new Date(params.birthday) : undefined
    )
  }
}