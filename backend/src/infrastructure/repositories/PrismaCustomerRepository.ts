import { PrismaClient, Customer as PrismaCustomer } from '@prisma/client'
import { ICustomerRepository } from '../../domain/repositories/ICustomerRepository'
import { Customer } from '../../domain/entities/Customer'
import { Email } from '../../domain/valueObjects/Email'
import { Password } from '../../domain/valueObjects/Password'
import { Gender } from '../../domain/valueObjects/Gender'

export class PrismaCustomerRepository implements ICustomerRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<Customer | null> {
    const customer = await this.prisma.customer.findUnique({
      where: { id }
    })

    return customer ? this.toDomain(customer) : null
  }

  async findByEmail(email: Email): Promise<Customer | null> {
    const customer = await this.prisma.customer.findFirst({
      where: { email: email.toString() }
    })

    return customer ? this.toDomain(customer) : null
  }

  async findByEmailAndStoreId(email: Email, storeId: string): Promise<Customer | null> {
    const customer = await this.prisma.customer.findFirst({
      where: {
        email: email.toString(),
        store_id: storeId
      }
    })

    return customer ? this.toDomain(customer) : null
  }

  async save(customer: Customer): Promise<Customer> {
    const data = {
      name: customer.name,
      email: customer.email.toString(),
      password: customer.password.toString(),
      store_id: customer.storeId,
      phone: customer.phone,
      gender: customer.gender?.toString() as any,
      birthday: customer.birthday,
      is_active: customer.isActive
    }

    const saved = await this.prisma.customer.create({
      data
    })

    return this.toDomain(saved)
  }

  private toDomain(prismaCustomer: PrismaCustomer): Customer {
    return new Customer(
      prismaCustomer.id,
      new Email(prismaCustomer.email),
      new Password(prismaCustomer.password),
      prismaCustomer.is_active,
      prismaCustomer.created_at,
      prismaCustomer.updated_at,
      prismaCustomer.name,
      prismaCustomer.store_id,
      prismaCustomer.phone,
      prismaCustomer.gender ? new Gender(prismaCustomer.gender as string) : undefined,
      prismaCustomer.birthday || undefined
    )
  }
}