import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../utils/auth'
import { AppError } from './errorHandler'

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
      throw new AppError('認証が必要です', 401)
    }

    const decoded = verifyToken(token)
    req.user = decoded

    next()
  } catch (error) {
    next(error)
  }
}

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('認証が必要です', 401))
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError('権限がありません', 403))
    }

    next()
  }
}

export const authorizeStoreAccess = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new AppError('認証が必要です', 401)
    }

    const storeId = req.params.storeId || req.body.storeId

    if (!storeId) {
      throw new AppError('店舗IDが必要です', 400)
    }

    if (req.user.role === 'admin') {
      return next()
    }

    if (req.user.role === 'store' && req.user.storeId === storeId) {
      return next()
    }

    throw new AppError('この店舗へのアクセス権限がありません', 403)
  } catch (error) {
    next(error)
  }
}