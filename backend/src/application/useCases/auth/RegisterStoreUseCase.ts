import { IStoreRepository } from '../../../domain/repositories/IStoreRepository'
import { IStaffRepository } from '../../../domain/repositories/IStaffRepository'
import { AuthService } from '../../../domain/services/AuthService'
import { Store } from '../../../domain/entities/Store'
import { Staff } from '../../../domain/entities/Staff'
import { Email } from '../../../domain/valueObjects/Email'
import { ConflictError } from '../../../shared/errors/AppError'
import { RegisterStoreDto, AuthResultDto } from '../../dto/auth.dto'
import { JwtService } from '../../../infrastructure/security/JwtService'

export class RegisterStoreUseCase {
  constructor(
    private storeRepository: IStoreRepository,
    private staffRepository: IStaffRepository,
    private authService: AuthService,
    private jwtService: JwtService
  ) {}

  async execute(dto: RegisterStoreDto): Promise<AuthResultDto> {
    const email = new Email(dto.email)

    const existingStore = await this.storeRepository.existsByEmail(email)
    if (existingStore) {
      throw new ConflictError('このメールアドレスは既に使用されています')
    }

    const store = Store.createNew({
      name: dto.name,
      email: dto.email,
      password: dto.password,
      phone: dto.phone
    })

    const hashedPassword = await this.authService.hashPassword(store.password)
    const savedStore = await this.storeRepository.save({
      ...store,
      password: { toString: () => hashedPassword } as any
    })

    const staff = Staff.createNew({
      email: dto.email,
      password: dto.password,
      name: '店舗オーナー',
      storeId: savedStore.id,
      staffRole: 'owner'
    })

    const savedStaff = await this.staffRepository.save({
      ...staff,
      password: { toString: () => hashedPassword } as any
    })

    const token = this.jwtService.generateToken({
      id: savedStaff.id,
      role: savedStaff.role,
      storeId: savedStore.id
    })

    return {
      token,
      user: {
        id: savedStaff.id,
        email: savedStaff.email.toString(),
        name: savedStaff.name,
        role: savedStaff.role,
        storeId: savedStore.id,
        storeName: savedStore.name
      }
    }
  }
}