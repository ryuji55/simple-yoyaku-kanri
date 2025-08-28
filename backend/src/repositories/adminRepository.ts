import { PrismaClient } from '@prisma/client';
import type { AdminData, CreateAdminInput } from '../types';

const prisma = new PrismaClient();

export class AdminRepository {
  async findByEmail(email: string): Promise<AdminData | null> {
    const admin = await prisma.admin.findUnique({
      where: { email },
    });
    return admin as AdminData | null;
  }

  async findById(id: string): Promise<AdminData | null> {
    const admin = await prisma.admin.findUnique({
      where: { id },
    });
    return admin as AdminData | null;
  }

  async create(data: CreateAdminInput): Promise<AdminData> {
    const admin = await prisma.admin.create({
      data: {
        email: data.email,
        password: data.password,
      },
    });
    return admin as AdminData;
  }

  async exists(): Promise<boolean> {
    const count = await prisma.admin.count();
    return count > 0;
  }
}
