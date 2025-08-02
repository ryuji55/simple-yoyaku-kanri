import { Request, Response, NextFunction } from 'express'
import { PrismaClient } from '@prisma/client'
import asyncHandler from 'express-async-handler'
import { generateToken, hashPassword, comparePassword } from '../utils/auth'
import { AppError } from '../middlewares/errorHandler'
import { AuthRequest, RegisterStoreRequest, RegisterCustomerRequest } from '../types'

const prisma = new PrismaClient()

export const loginAdmin = asyncHandler(async (
  req: Request<{}, {}, AuthRequest>,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body

  const admin = await prisma.admin.findUnique({
    where: { email }
  })

  if (!admin || !(await comparePassword(password, admin.password))) {
    throw new AppError('メールアドレスまたはパスワードが正しくありません', 401)
  }

  const token = generateToken({
    id: admin.id,
    role: 'admin'
  })

  res.json({
    success: true,
    token,
    user: {
      id: admin.id,
      email: admin.email,
      role: 'admin'
    }
  })
})

export const loginStore = asyncHandler(async (
  req: Request<{}, {}, AuthRequest>,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body

  const staff = await prisma.staff.findFirst({
    where: {
      email,
      role: 'owner'
    },
    include: {
      store: true
    }
  })

  if (!staff || !(await comparePassword(password, staff.password))) {
    throw new AppError('メールアドレスまたはパスワードが正しくありません', 401)
  }

  if (!staff.is_active) {
    throw new AppError('アカウントが無効化されています', 403)
  }

  const token = generateToken({
    id: staff.id,
    role: 'store',
    storeId: staff.storeId
  })

  res.json({
    success: true,
    token,
    user: {
      id: staff.id,
      email: staff.email,
      name: staff.name,
      role: 'store',
      storeId: staff.storeId,
      storeName: staff.store.name
    }
  })
})

export const loginCustomer = asyncHandler(async (
  req: Request<{}, {}, AuthRequest>,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body

  const customer = await prisma.customer.findFirst({
    where: { email },
    include: {
      store: true
    }
  })

  if (!customer || !(await comparePassword(password, customer.password))) {
    throw new AppError('メールアドレスまたはパスワードが正しくありません', 401)
  }

  if (!customer.is_active) {
    throw new AppError('アカウントが無効化されています', 403)
  }

  const token = generateToken({
    id: customer.id,
    role: 'customer',
    storeId: customer.storeId
  })

  res.json({
    success: true,
    token,
    user: {
      id: customer.id,
      email: customer.email,
      name: customer.name,
      role: 'customer',
      storeId: customer.storeId,
      storeName: customer.store.name
    }
  })
})

export const registerStore = asyncHandler(async (
  req: Request<{}, {}, RegisterStoreRequest>,
  res: Response,
  next: NextFunction
) => {
  const { name, email, password, phone } = req.body

  const existingStore = await prisma.store.findUnique({
    where: { email }
  })

  if (existingStore) {
    throw new AppError('このメールアドレスは既に使用されています', 400)
  }

  const hashedPassword = await hashPassword(password)

  const store = await prisma.store.create({
    data: {
      name,
      email,
      password: hashedPassword,
      phone,
      cancel_deadline_hour: 24,
      online_booking_deadline_minute: 60,
      max_reservation_month_ahead: 3
    }
  })

  const staff = await prisma.staff.create({
    data: {
      storeId: store.id,
      name: '店舗オーナー',
      email,
      password: hashedPassword,
      role: 'owner'
    }
  })

  const token = generateToken({
    id: staff.id,
    role: 'store',
    storeId: store.id
  })

  res.status(201).json({
    success: true,
    token,
    user: {
      id: staff.id,
      email: staff.email,
      name: staff.name,
      role: 'store',
      storeId: store.id,
      storeName: store.name
    }
  })
})

export const registerCustomer = asyncHandler(async (
  req: Request<{}, {}, RegisterCustomerRequest>,
  res: Response,
  next: NextFunction
) => {
  const { storeId, name, email, password, phone, gender, birthday } = req.body

  const store = await prisma.store.findUnique({
    where: { id: storeId }
  })

  if (!store) {
    throw new AppError('店舗が見つかりません', 404)
  }

  const existingCustomer = await prisma.customer.findFirst({
    where: {
      email,
      storeId
    }
  })

  if (existingCustomer) {
    throw new AppError('このメールアドレスは既に使用されています', 400)
  }

  const hashedPassword = await hashPassword(password)

  const customer = await prisma.customer.create({
    data: {
      storeId,
      name,
      email,
      password: hashedPassword,
      phone,
      gender: gender as any,
      birthday: birthday ? new Date(birthday) : undefined
    }
  })

  const token = generateToken({
    id: customer.id,
    role: 'customer',
    storeId: customer.storeId
  })

  res.status(201).json({
    success: true,
    token,
    user: {
      id: customer.id,
      email: customer.email,
      name: customer.name,
      role: 'customer',
      storeId: customer.storeId,
      storeName: store.name
    }
  })
})