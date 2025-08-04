import { Router, Request, Response } from 'express'
import { PrismaClient } from '../../../generated/prisma'
import { PrismaStoreRepository } from '../../infrastructure/repositories/PrismaStoreRepository'

const router = Router()
const prisma = new PrismaClient()

// 短縮URL - ログインページへリダイレクト
router.get('/s/:qrCode', async (req: Request, res: Response) => {
  const { qrCode } = req.params
  
  const storeRepository = new PrismaStoreRepository(prisma)
  const store = await storeRepository.findByQrCode(qrCode)
  
  if (!store) {
    return res.status(404).send('店舗が見つかりません')
  }
  
  // フロントエンドのログインページにリダイレクト
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000'
  res.redirect(`${frontendUrl}/login/customer?store=${qrCode}`)
})

export default router