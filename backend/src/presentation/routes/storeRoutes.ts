import { Router } from 'express'
import { StoreController } from '../controllers/StoreController'
import { asyncHandler } from '../middlewares/asyncHandler'

const router = Router()
const storeController = new StoreController()

// QRコード取得
router.get('/:storeId/qrcode', asyncHandler(storeController.getQRCode))

export default router