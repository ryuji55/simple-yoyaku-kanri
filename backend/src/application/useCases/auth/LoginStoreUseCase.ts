import { IStaffRepository } from '../../../domain/repositories/IStaffRepository'
import { IStoreRepository } from '../../../domain/repositories/IStoreRepository'
import { AuthService } from '../../../domain/services/AuthService'
import { Email } from '../../../domain/valueObjects/Email'
import { Password } from '../../../domain/valueObjects/Password'
import { UnauthorizedError } from '../../../shared/errors/AppError'
import { LoginDto, AuthResultDto } from '../../dto/auth.dto'
import { JwtService } from '../../../infrastructure/security/JwtService'

export class LoginStoreUseCase {
  constructor(
    private staffRepository: IStaffRepository,
    private storeRepository: IStoreRepository,
    private authService: AuthService,
    private jwtService: JwtService
  ) {}

  async execute(dto: LoginDto): Promise<AuthResultDto> {
    const email = new Email(dto.email)
    const password = new Password(dto.password)

    const staff = await this.staffRepository.findByEmail(email)
    if (!staff || !staff.isOwner()) {
      throw new UnauthorizedError('メールアドレスまたはパスワードが正しくありません')
    }

    const isPasswordValid = await this.authService.verifyPassword(
      password,
      staff.password.toString()
    )

    if (!isPasswordValid) {
      throw new UnauthorizedError('メールアドレスまたはパスワードが正しくありません')
    }

    if (!staff.canLogin()) {
      throw new UnauthorizedError('アカウントが無効化されています')
    }

    const store = await this.storeRepository.findById(staff.storeId)
    if (!store) {
      throw new UnauthorizedError('店舗情報が見つかりません')
    }

    const token = this.jwtService.generateToken({
      id: staff.id,
      role: staff.role,
      storeId: staff.storeId
    })

    return {
      token,
      user: {
        id: staff.id,
        email: staff.email.toString(),
        name: staff.name,
        role: staff.role,
        storeId: staff.storeId,
        storeName: store.name
      }
    }
  }
}