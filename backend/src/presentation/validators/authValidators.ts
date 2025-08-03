import { body, ValidationChain } from 'express-validator'

export const loginValidator: ValidationChain[] = [
  body('email')
    .notEmpty().withMessage('メールアドレスは必須です')
    .isEmail().withMessage('有効なメールアドレスを入力してください'),
  body('password')
    .notEmpty().withMessage('パスワードは必須です')
]

export const registerStoreValidator: ValidationChain[] = [
  body('name')
    .notEmpty().withMessage('店舗名は必須です')
    .isLength({ min: 1, max: 100 }).withMessage('店舗名は1〜100文字で入力してください'),
  body('email')
    .notEmpty().withMessage('メールアドレスは必須です')
    .isEmail().withMessage('有効なメールアドレスを入力してください'),
  body('password')
    .notEmpty().withMessage('パスワードは必須です')
    .isLength({ min: 6 }).withMessage('パスワードは6文字以上で入力してください'),
  body('phone')
    .notEmpty().withMessage('電話番号は必須です')
    .matches(/^[\d-]+$/).withMessage('有効な電話番号を入力してください'),
  body('ownerName')
    .notEmpty().withMessage('オーナー名は必須です')
    .isLength({ min: 1, max: 100 }).withMessage('オーナー名は1〜100文字で入力してください')
]

export const registerCustomerValidator: ValidationChain[] = [
  body('storeId')
    .notEmpty().withMessage('店舗IDは必須です')
    .isUUID().withMessage('有効な店舗IDを入力してください'),
  body('name')
    .notEmpty().withMessage('名前は必須です')
    .isLength({ min: 1, max: 100 }).withMessage('名前は1〜100文字で入力してください'),
  body('email')
    .notEmpty().withMessage('メールアドレスは必須です')
    .isEmail().withMessage('有効なメールアドレスを入力してください'),
  body('password')
    .notEmpty().withMessage('パスワードは必須です')
    .isLength({ min: 6 }).withMessage('パスワードは6文字以上で入力してください'),
  body('phone')
    .optional()
    .matches(/^[\d-]+$/).withMessage('有効な電話番号を入力してください'),
  body('gender')
    .optional()
    .isIn(['male', 'female', 'other']).withMessage('性別が無効です'),
  body('birthday')
    .optional()
    .isISO8601().withMessage('誕生日の形式が無効です')
]