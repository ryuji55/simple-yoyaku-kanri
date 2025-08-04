import { PrismaClient, Store as PrismaStore } from '../../../generated/prisma'
import { IStoreRepository } from '../../domain/repositories/IStoreRepository'
import { Store } from '../../domain/entities/Store'
import { Email } from '../../domain/valueObjects/Email'
import { Password } from '../../domain/valueObjects/Password'

export class PrismaStoreRepository implements IStoreRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<Store | null> {
    const store = await this.prisma.store.findUnique({
      where: { id }
    })

    return store ? this.toDomain(store) : null
  }

  async findByEmail(email: Email): Promise<Store | null> {
    const store = await this.prisma.store.findUnique({
      where: { email: email.toString() }
    })

    return store ? this.toDomain(store) : null
  }

  async findByQrCode(qrCode: string): Promise<Store | null> {
    const store = await this.prisma.store.findUnique({
      where: { qr_code: qrCode }
    })

    return store ? this.toDomain(store) : null
  }

  async save(store: Store): Promise<Store> {
    const data = {
      name: store.name,
      email: store.email.toString(),
      password: store.password.toString(),
      phone: store.phone,
      qr_code: store.qrCode,
      is_active: store.isActive,
      cancel_deadline_hour: store.cancelDeadlineHour,
      online_booking_deadline_minute: store.onlineBookingDeadlineMinute,
      max_reservation_month_ahead: store.maxReservationMonthAhead
    }

    const saved = await this.prisma.store.create({
      data
    })

    return this.toDomain(saved)
  }

  async existsByEmail(email: Email): Promise<boolean> {
    const count = await this.prisma.store.count({
      where: { email: email.toString() }
    })

    return count > 0
  }

  private toDomain(prismaStore: PrismaStore): Store {
    return new Store(
      prismaStore.id,
      prismaStore.name,
      new Email(prismaStore.email),
      Password.fromHash(prismaStore.password),
      prismaStore.phone,
      prismaStore.is_active,
      prismaStore.cancel_deadline_hour,
      prismaStore.online_booking_deadline_minute,
      prismaStore.max_reservation_month_ahead,
      prismaStore.createdAt,
      prismaStore.updatedAt,
      prismaStore.qr_code || undefined
    )
  }
}