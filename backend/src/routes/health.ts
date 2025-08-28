import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/health', async (_req, res) => {
  let dbStatus = false;
  
  try {
    // Attempt to connect to the database
    await prisma.$queryRaw`SELECT 1`;
    dbStatus = true;
  } catch (error) {
    console.error('Database connection failed:', error);
    dbStatus = false;
  }
  
  res.status(200).json({
    status: 'ok',
    db: dbStatus
  });
});

export default router;