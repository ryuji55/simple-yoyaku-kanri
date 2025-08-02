import { Router } from 'express'
import { body } from 'express-validator'
import { validate } from '../middlewares/validation'
import {
  loginAdmin,
  loginStore,
  loginCustomer,
  registerStore,
  registerCustomer
} from '../controllers/authController'

const router = Router()

const loginValidation = [
  body('email').isEmail().withMessage('有効なメールアドレスを入力してください'),
  body('password').notEmpty().withMessage('パスワードを入力してください')
]

const registerStoreValidation = [
  body('name').notEmpty().withMessage('店舗名を入力してください'),
  body('email').isEmail().withMessage('有効なメールアドレスを入力してください'),
  body('password').isLength({ min: 6 }).withMessage('パスワードは6文字以上で入力してください'),
  body('phone').notEmpty().withMessage('電話番号を入力してください')
]

const registerCustomerValidation = [
  body('storeId').isUUID().withMessage('有効な店舗IDを入力してください'),
  body('name').notEmpty().withMessage('名前を入力してください'),
  body('email').isEmail().withMessage('有効なメールアドレスを入力してください'),
  body('password').isLength({ min: 6 }).withMessage('パスワードは6文字以上で入力してください'),
  body('phone').notEmpty().withMessage('電話番号を入力してください'),
  body('gender').optional().isIn(['male', 'female', 'other']).withMessage('性別が無効です'),
  body('birthday').optional().isISO8601().withMessage('誕生日の形式が無効です')
]

router.post('/login/admin', validate(loginValidation), loginAdmin)
router.post('/login/store', validate(loginValidation), loginStore)
router.post('/login/customer', validate(loginValidation), loginCustomer)
router.post('/register/store', validate(registerStoreValidation), registerStore)
router.post('/register/customer', validate(registerCustomerValidation), registerCustomer)

export default router