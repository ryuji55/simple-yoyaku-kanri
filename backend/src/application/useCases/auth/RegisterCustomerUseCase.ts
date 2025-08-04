import { ICustomerRepository } from '../../../domain/repositories/ICustomerRepository'
import { IStoreRepository } from '../../../domain/repositories/IStoreRepository'
import { AuthService } from '../../../domain/services/AuthService'
import { Customer } from '../../../domain/entities/Customer'
import { Email } from '../../../domain/valueObjects/Email'
import { Password } from '../../../domain/valueObjects/Password'
import { ConflictError, NotFoundError } from '../../../shared/errors/AppError'
import { RegisterCustomerDto, AuthResultDto } from '../../dto/auth.dto'
import { JwtService } from '../../../infrastructure/security/JwtService'

export class RegisterCustomerUseCase {
  constructor(
    private customerRepository: ICustomerRepository,
    private storeRepository: IStoreRepository,
    private authService: AuthService,
    private jwtService: JwtService
  ) {}

  async execute(dto: RegisterCustomerDto): Promise<AuthResultDto> {
    const store = await this.storeRepository.findByQrCode(dto.storeCode)
    if (!store) {
      throw new NotFoundError('店舗が見つかりません')
    }

    const email = new Email(dto.email)
    const existingCustomer = await this.customerRepository.findByEmailAndStoreId(
      email,
      store.id
    )

    if (existingCustomer) {
      throw new ConflictError('このメールアドレスは既に使用されています')
    }

    const customer = Customer.createNew({
      email: dto.email,
      password: dto.password,
      name: dto.name,
      storeId: store.id,
      phone: dto.phone,
      gender: dto.gender,
      birthday: dto.birthday
    })

    const hashedPassword = await this.authService.hashPassword(customer.password)
    const customerWithHashedPassword = Object.assign(
      Object.create(Object.getPrototypeOf(customer)),
      customer,
      { password: Password.fromHash(hashedPassword) }
    )
    
    const savedCustomer = await this.customerRepository.save(customerWithHashedPassword)

    const token = this.jwtService.generateToken({
      id: savedCustomer.id,
      role: savedCustomer.role,
      storeId: savedCustomer.storeId
    })

    return {
      token,
      user: {
        id: savedCustomer.id,
        email: savedCustomer.email.toString(),
        name: savedCustomer.name,
        role: savedCustomer.role,
        storeId: savedCustomer.storeId,
        storeName: store.name
      }
    }
  }
}