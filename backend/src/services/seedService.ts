import { AdminRepository } from '../repositories/adminRepository';
import { AuthService } from './authService';
import { config } from '../config/env';

export class SeedService {
  private adminRepository: AdminRepository;
  private authService: AuthService;

  constructor() {
    this.adminRepository = new AdminRepository();
    this.authService = new AuthService();
  }

  async seedInitialAdminIfNeeded(): Promise<void> {
    const seedEmail = process.env.SEED_ADMIN_EMAIL;
    const seedPassword = process.env.SEED_ADMIN_PASSWORD;
    const autoSeed = process.env.AUTO_SEED_ADMIN === 'true';

    // 環境変数が設定されていない場合はスキップ
    if (!seedEmail || !seedPassword) {
      if (autoSeed) {
        console.warn('⚠️  AUTO_SEED_ADMIN is true but SEED_ADMIN_EMAIL or SEED_ADMIN_PASSWORD is not set');
      }
      return;
    }

    // 既に管理者が存在する場合はスキップ
    const adminExists = await this.adminRepository.exists();
    if (adminExists) {
      console.log('✅ Admin already exists, skipping seed');
      return;
    }

    try {
      // 既存のメールアドレスチェック
      const existingAdmin = await this.adminRepository.findByEmail(seedEmail);
      if (existingAdmin) {
        console.log('✅ Admin with this email already exists, skipping seed');
        return;
      }

      // パスワードハッシュ化
      const hashedPassword = await this.authService.hashPassword(seedPassword);

      // 管理者作成
      const admin = await this.adminRepository.create({
        email: seedEmail,
        password: hashedPassword,
      });

      console.log(`✅ Initial admin created successfully!`);
      console.log(`   Email: ${admin.email}`);
      console.log(`   Created at: ${admin.createdAt}`);

    } catch (error) {
      console.error('❌ Failed to create initial admin:', error);
      // 開発環境では詳細エラーを表示、本番環境では隠す
      if (config.isDevelopment) {
        console.error(error);
      }
      throw error; // アプリケーション起動を停止
    }
  }
}