import { PrismaClient, Admin as PrismaAdmin } from '../../../generated/prisma'
import { IAdminRepository } from '../../domain/repositories/IAdminRepository'
import { Admin } from '../../domain/entities/Admin'
import { Email } from '../../domain/valueObjects/Email'
import { Password } from '../../domain/valueObjects/Password'

export class PrismaAdminRepository implements IAdminRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<Admin | null> {
    const admin = await this.prisma.admin.findUnique({
      where: { id }
    })

    return admin ? this.toDomain(admin) : null
  }

  async findByEmail(email: Email): Promise<Admin | null> {
    const admin = await this.prisma.admin.findUnique({
      where: { email: email.toString() }
    })

    return admin ? this.toDomain(admin) : null
  }

  async save(admin: Admin): Promise<Admin> {
    const data = {
      email: admin.email.toString(),
      password: admin.password.toString(),
      is_active: admin.isActive
    }

    const saved = await this.prisma.admin.upsert({
      where: { id: admin.id || '' },
      update: data,
      create: data
    })

    return this.toDomain(saved)
  }

  private toDomain(prismaAdmin: PrismaAdmin): Admin {
    return new Admin(
      prismaAdmin.id,
      new Email(prismaAdmin.email),
      Password.fromHash(prismaAdmin.password),
      prismaAdmin.is_active,
      prismaAdmin.createdAt,
      prismaAdmin.updatedAt
    )
  }
}