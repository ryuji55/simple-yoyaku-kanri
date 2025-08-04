import { ICustomerRepository } from '../../../domain/repositories/ICustomerRepository'
import { IStoreRepository } from '../../../domain/repositories/IStoreRepository'
import { AuthService } from '../../../domain/services/AuthService'
import { Email } from '../../../domain/valueObjects/Email'
import { Password } from '../../../domain/valueObjects/Password'
import { UnauthorizedError } from '../../../shared/errors/AppError'
import { LoginDto, AuthResultDto } from '../../dto/auth.dto'
import { JwtService } from '../../../infrastructure/security/JwtService'

export class LoginCustomerUseCase {
  constructor(
    private customerRepository: ICustomerRepository,
    private storeRepository: IStoreRepository,
    private authService: AuthService,
    private jwtService: JwtService
  ) {}

  async execute(dto: LoginDto): Promise<AuthResultDto> {
    if (!dto.storeCode) {
      throw new UnauthorizedError('店舗コードが必要です')
    }

    const store = await this.storeRepository.findByQrCode(dto.storeCode)
    if (!store) {
      throw new UnauthorizedError('店舗が見つかりません')
    }

    const email = new Email(dto.email)
    const password = new Password(dto.password)

    const customer = await this.customerRepository.findByEmailAndStoreId(email, store.id)
    if (!customer) {
      throw new UnauthorizedError('メールアドレスまたはパスワードが正しくありません')
    }

    const isPasswordValid = await this.authService.verifyPassword(
      password,
      customer.password.toString()
    )

    if (!isPasswordValid) {
      throw new UnauthorizedError('メールアドレスまたはパスワードが正しくありません')
    }

    if (!customer.canLogin()) {
      throw new UnauthorizedError('アカウントが無効化されています')
    }


    const token = this.jwtService.generateToken({
      id: customer.id,
      role: customer.role,
      storeId: customer.storeId
    })

    return {
      token,
      user: {
        id: customer.id,
        email: customer.email.toString(),
        name: customer.name,
        role: customer.role,
        storeId: customer.storeId,
        storeName: store.name
      }
    }
  }
}