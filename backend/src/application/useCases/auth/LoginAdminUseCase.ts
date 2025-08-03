import { IAdminRepository } from '../../../domain/repositories/IAdminRepository'
import { AuthService } from '../../../domain/services/AuthService'
import { Email } from '../../../domain/valueObjects/Email'
import { Password } from '../../../domain/valueObjects/Password'
import { UnauthorizedError } from '../../../shared/errors/AppError'
import { LoginDto, AuthResultDto } from '../../dto/auth.dto'
import { JwtService } from '../../../infrastructure/security/JwtService'

export class LoginAdminUseCase {
  constructor(
    private adminRepository: IAdminRepository,
    private authService: AuthService,
    private jwtService: JwtService
  ) {}

  async execute(dto: LoginDto): Promise<AuthResultDto> {
    const email = new Email(dto.email)
    const password = new Password(dto.password)

    const admin = await this.adminRepository.findByEmail(email)
    if (!admin) {
      throw new UnauthorizedError('メールアドレスまたはパスワードが正しくありません')
    }

    const isPasswordValid = await this.authService.verifyPassword(
      password,
      admin.password.toString()
    )

    if (!isPasswordValid) {
      throw new UnauthorizedError('メールアドレスまたはパスワードが正しくありません')
    }

    if (!admin.canLogin()) {
      throw new UnauthorizedError('アカウントが無効化されています')
    }

    const token = this.jwtService.generateToken({
      id: admin.id,
      role: admin.role
    })

    return {
      token,
      user: {
        id: admin.id,
        email: admin.email.toString(),
        role: admin.role
      }
    }
  }
}