import { PrismaClient } from '../../generated/prisma';
import { AdminData, CreateAdminInput } from '../types';

const prisma = new PrismaClient();

export class AdminRepository {
  async findByEmail(email: string): Promise<AdminData | null> {
    const admin = await prisma.admin.findUnique({
      where: { email }
    });
    return admin;
  }

  async findById(id: string): Promise<AdminData | null> {
    const admin = await prisma.admin.findUnique({
      where: { id }
    });
    return admin;
  }

  async create(data: CreateAdminInput): Promise<AdminData> {
    const admin = await prisma.admin.create({
      data: {
        email: data.email,
        password: data.password
      }
    });
    return admin;
  }

  async exists(): Promise<boolean> {
    const count = await prisma.admin.count();
    return count > 0;
  }
}