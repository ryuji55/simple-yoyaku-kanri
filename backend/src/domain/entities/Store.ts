import { Email } from '../valueObjects/Email'
import { Password } from '../valueObjects/Password'

export interface IStore {
  id: string
  name: string
  email: Email
  password: Password
  phone: string
  isActive: boolean
  cancelDeadlineHour: number
  onlineBookingDeadlineMinute: number
  maxReservationMonthAhead: number
  createdAt: Date
  updatedAt: Date
}

export class Store implements IStore {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: Email,
    public readonly password: Password,
    public readonly phone: string,
    public readonly isActive: boolean,
    public readonly cancelDeadlineHour: number,
    public readonly onlineBookingDeadlineMinute: number,
    public readonly maxReservationMonthAhead: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  static createNew(params: {
    name: string
    email: string
    password: string
    phone: string
  }): Store {
    return new Store(
      '',
      params.name,
      new Email(params.email),
      new Password(params.password),
      params.phone,
      true,
      24, // デフォルト24時間前まで
      60, // デフォルト60分前まで
      3,  // デフォルト3ヶ月先まで
      new Date(),
      new Date()
    )
  }
}