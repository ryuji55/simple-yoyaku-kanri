import { Router } from 'express'
import { body, param } from 'express-validator'
import { validate } from '../middlewares/validation'
import { authenticate, authorize, authorizeStoreAccess } from '../middlewares/auth'
import {
  getStore,
  updateStore,
  updateStoreSettings,
  getStoreSettings,
  getAllStores
} from '../controllers/storeController'

const router = Router()

const storeIdValidation = [
  param('id').isUUID().withMessage('有効な店舗IDを入力してください')
]

const updateStoreValidation = [
  body('name').optional().notEmpty().withMessage('店舗名を入力してください'),
  body('email').optional().isEmail().withMessage('有効なメールアドレスを入力してください'),
  body('phone').optional().notEmpty().withMessage('電話番号を入力してください')
]

const updateSettingsValidation = [
  body('cancelDeadlineHour').optional().isInt({ min: 0 }).withMessage('キャンセル期限は0以上の整数で入力してください'),
  body('onlineBookingDeadlineMinute').optional().isInt({ min: 0 }).withMessage('予約締切時間は0以上の整数で入力してください'),
  body('maxReservationMonthAhead').optional().isInt({ min: 1, max: 12 }).withMessage('最大予約可能月数は1〜12の整数で入力してください')
]

router.get('/stores', authenticate, authorize('admin'), getAllStores)
router.get('/stores/:id', authenticate, getStore)
router.patch('/stores/:id', authenticate, authorize('admin', 'store'), validate([...storeIdValidation, ...updateStoreValidation]), authorizeStoreAccess, updateStore)
router.get('/stores/:id/settings', authenticate, validate(storeIdValidation), getStoreSettings)
router.patch('/stores/:id/settings', authenticate, authorize('admin', 'store'), validate([...storeIdValidation, ...updateSettingsValidation]), authorizeStoreAccess, updateStoreSettings)

export default router