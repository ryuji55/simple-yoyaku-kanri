import { Request, Response } from 'express'
import { PrismaClient } from '../../../generated/prisma'
import { GetStoreQRCodeUseCase } from '../../application/useCases/store/GetStoreQRCodeUseCase'
import { PrismaStoreRepository } from '../../infrastructure/repositories/PrismaStoreRepository'
import { config } from '../../config/env'

export class StoreController {
  private prisma = new PrismaClient()

  getQRCode = async (req: Request, res: Response) => {
    const { storeId } = req.params

    const storeRepository = new PrismaStoreRepository(this.prisma)
    const useCase = new GetStoreQRCodeUseCase(
      storeRepository,
      config.frontend.url
    )

    const result = await useCase.execute(storeId)
    res.json({ success: true, ...result })
  }
}