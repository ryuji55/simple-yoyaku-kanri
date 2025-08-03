import { PrismaClient, Staff as PrismaStaff } from '@prisma/client'
import { IStaffRepository } from '../../domain/repositories/IStaffRepository'
import { Staff, StaffRole } from '../../domain/entities/Staff'
import { Email } from '../../domain/valueObjects/Email'
import { Password } from '../../domain/valueObjects/Password'
import { Gender } from '../../domain/valueObjects/Gender'

export class PrismaStaffRepository implements IStaffRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<Staff | null> {
    const staff = await this.prisma.staff.findUnique({
      where: { id }
    })

    return staff ? this.toDomain(staff) : null
  }

  async findByEmail(email: Email): Promise<Staff | null> {
    const staff = await this.prisma.staff.findFirst({
      where: { email: email.toString() }
    })

    return staff ? this.toDomain(staff) : null
  }

  async findByEmailAndStoreId(email: Email, storeId: string): Promise<Staff | null> {
    const staff = await this.prisma.staff.findFirst({
      where: {
        email: email.toString(),
        store_id: storeId
      }
    })

    return staff ? this.toDomain(staff) : null
  }

  async findOwnerByStoreId(storeId: string): Promise<Staff | null> {
    const staff = await this.prisma.staff.findFirst({
      where: {
        store_id: storeId,
        role: 'owner'
      }
    })

    return staff ? this.toDomain(staff) : null
  }

  async save(staff: Staff): Promise<Staff> {
    const data = {
      name: staff.name,
      email: staff.email.toString(),
      password: staff.password.toString(),
      store_id: staff.storeId,
      role: staff.staffRole,
      profile: staff.profile,
      gender: staff.gender?.toString() as any,
      birthday: staff.birthday,
      is_active: staff.isActive
    }

    const saved = await this.prisma.staff.create({
      data
    })

    return this.toDomain(saved)
  }

  private toDomain(prismaStaff: PrismaStaff): Staff {
    return new Staff(
      prismaStaff.id,
      new Email(prismaStaff.email),
      new Password(prismaStaff.password),
      prismaStaff.is_active,
      prismaStaff.created_at,
      prismaStaff.updated_at,
      prismaStaff.name,
      prismaStaff.store_id,
      prismaStaff.role as StaffRole,
      prismaStaff.profile || undefined,
      prismaStaff.gender ? new Gender(prismaStaff.gender as string) : undefined,
      prismaStaff.birthday || undefined
    )
  }
}