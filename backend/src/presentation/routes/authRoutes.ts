import { Router } from 'express'
import { AuthController } from '../controllers/AuthController'
import { asyncHandler } from '../middlewares/asyncHandler'
import { validateRequest } from '../middlewares/validateRequest'
import {
  loginValidator,
  registerStoreValidator,
  registerCustomerValidator
} from '../validators/authValidators'

const router = Router()
const authController = new AuthController()

// ログイン
router.post(
  '/login/admin',
  validateRequest(loginValidator),
  asyncHandler(authController.loginAdmin)
)

router.post(
  '/login/store',
  validateRequest(loginValidator),
  asyncHandler(authController.loginStore)
)

router.post(
  '/login/customer',
  validateRequest(loginValidator),
  asyncHandler(authController.loginCustomer)
)

// 新規登録
router.post(
  '/register/store',
  validateRequest(registerStoreValidator),
  asyncHandler(authController.registerStore)
)

router.post(
  '/register/customer',
  validateRequest(registerCustomerValidator),
  asyncHandler(authController.registerCustomer)
)

export default router