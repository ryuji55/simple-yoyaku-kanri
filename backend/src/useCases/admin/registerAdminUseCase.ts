import { AdminRepository } from '../../repositories/adminRepository';
import { AuthService } from '../../services/authService';
import { ValidationService } from '../../services/validationService';
import { CreateAdminInput, AdminData } from '../../types';

export class RegisterAdminUseCase {
  private adminRepository: AdminRepository;
  private authService: AuthService;

  constructor() {
    this.adminRepository = new AdminRepository();
    this.authService = new AuthService();
  }

  async execute(input: CreateAdminInput): Promise<{ admin: AdminData; token: string }> {
    // Validate input
    const validatedInput = ValidationService.validate<CreateAdminInput>(
      ValidationService.adminRegistrationSchema,
      input
    );

    // Check if admin already exists
    const existingAdmin = await this.adminRepository.findByEmail(validatedInput.email);
    if (existingAdmin) {
      throw new Error('このメールアドレスは既に登録されています');
    }

    // Check if this is the first admin (for security reasons, you might want to limit admin creation)
    const hasAdmins = await this.adminRepository.exists();
    if (hasAdmins && process.env.ALLOW_MULTIPLE_ADMINS !== 'true') {
      throw new Error('システム管理者は既に存在します。追加の管理者登録は許可されていません。');
    }

    // Hash password
    const hashedPassword = await this.authService.hashPassword(validatedInput.password);

    // Create admin
    const admin = await this.adminRepository.create({
      email: validatedInput.email,
      password: hashedPassword
    });

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