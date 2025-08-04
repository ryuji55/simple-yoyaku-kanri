import { AdminRepository } from '../../repositories/adminRepository';
import { AuthService } from '../../services/authService';
import { ValidationService } from '../../services/validationService';
import { LoginInput, AdminData } from '../../types';

export class LoginUseCase {
  private adminRepository: AdminRepository;
  private authService: AuthService;

  constructor() {
    this.adminRepository = new AdminRepository();
    this.authService = new AuthService();
  }

  async execute(input: LoginInput): Promise<{ admin: AdminData; token: string }> {
    // Validate input
    const validatedInput = ValidationService.validate<LoginInput>(
      ValidationService.loginSchema,
      input
    );

    // Find admin by email
    const admin = await this.adminRepository.findByEmail(validatedInput.email);
    if (!admin) {
      throw new Error('メールアドレスまたはパスワードが正しくありません');
    }

    // Check if account is active
    if (!admin.is_active) {
      throw new Error('このアカウントは無効化されています');
    }

    // Verify password
    const isPasswordValid = await this.authService.comparePassword(
      validatedInput.password,
      admin.password!
    );
    if (!isPasswordValid) {
      throw new Error('メールアドレスまたはパスワードが正しくありません');
    }

    // Generate token
    const token = this.authService.generateToken({
      id: admin.id,
      email: admin.email,
      role: 'admin'
    });

    // Remove password from response
    const { password, ...adminWithoutPassword } = admin;

    return {
      admin: adminWithoutPassword as AdminData,
      token
    };
  }
}