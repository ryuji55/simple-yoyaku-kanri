import { User } from './User'
import { Email } from '../valueObjects/Email'
import { Password } from '../valueObjects/Password'
import { Gender } from '../valueObjects/Gender'

export type StaffRole = 'owner' | 'staff'

export interface IStaff extends User {
  name: string
  storeId: string
  staffRole: StaffRole
  profile?: string
  gender?: Gender
  birthday?: Date
}

export class Staff extends User implements IStaff {
  constructor(
    id: string,
    email: Email,
    password: Password,
    isActive: boolean,
    createdAt: Date,
    updatedAt: Date,
    public readonly name: string,
    public readonly storeId: string,
    public readonly staffRole: StaffRole,
    public readonly profile?: string,
    public readonly gender?: Gender,
    public readonly birthday?: Date
  ) {
    super(id, email, password, 'store', isActive, createdAt, updatedAt)
  }

  static createNew(params: {
    email: string
    password: string
    name: string
    storeId: string
    staffRole: StaffRole
    gender?: string
    birthday?: string
  }): Staff {
    return new Staff(
      '',
      new Email(params.email),
      new Password(params.password),
      true,
      new Date(),
      new Date(),
      params.name,
      params.storeId,
      params.staffRole,
      undefined,
      params.gender ? new Gender(params.gender) : undefined,
      params.birthday ? new Date(params.birthday) : undefined
    )
  }

  isOwner(): boolean {
    return this.staffRole === 'owner'
  }
}