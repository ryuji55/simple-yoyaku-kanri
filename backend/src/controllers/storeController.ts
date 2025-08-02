import { Request, Response, NextFunction } from 'express'
import { PrismaClient } from '@prisma/client'
import asyncHandler from 'express-async-handler'
import { AppError } from '../middlewares/errorHandler'

const prisma = new PrismaClient()

export const getStore = asyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params

  const store = await prisma.store.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          staffs: true,
          customers: true,
          menus: true,
          bookings: true
        }
      }
    }
  })

  if (!store) {
    throw new AppError('店舗が見つかりません', 404)
  }

  res.json({
    success: true,
    data: store
  })
})

export const updateStore = asyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params
  const updateData = req.body

  delete updateData.id
  delete updateData.createdAt
  delete updateData.updatedAt

  const store = await prisma.store.update({
    where: { id },
    data: updateData
  })

  res.json({
    success: true,
    data: store
  })
})

export const updateStoreSettings = asyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params
  const { cancelDeadlineHour, onlineBookingDeadlineMinute, maxReservationMonthAhead } = req.body

  const updateData: any = {}
  if (cancelDeadlineHour !== undefined) updateData.cancelDeadlineHour = cancelDeadlineHour
  if (onlineBookingDeadlineMinute !== undefined) updateData.onlineBookingDeadlineMinute = onlineBookingDeadlineMinute
  if (maxReservationMonthAhead !== undefined) updateData.maxReservationMonthAhead = maxReservationMonthAhead

  const store = await prisma.store.update({
    where: { id },
    data: updateData
  })

  res.json({
    success: true,
    data: {
      cancelDeadlineHour: store.cancel_deadline_hour,
      onlineBookingDeadlineMinute: store.online_booking_deadline_minute,
      maxReservationMonthAhead: store.max_reservation_month_ahead
    }
  })
})

export const getStoreSettings = asyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params

  const store = await prisma.store.findUnique({
    where: { id },
    select: {
      cancel_deadline_hour: true,
      online_booking_deadline_minute: true,
      max_reservation_month_ahead: true
    }
  })

  if (!store) {
    throw new AppError('店舗が見つかりません', 404)
  }

  res.json({
    success: true,
    data: store
  })
})

export const getAllStores = asyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const stores = await prisma.store.findMany({
    where: { is_active: true },
    include: {
      _count: {
        select: {
          staffs: true,
          customers: true,
          menus: true,
          bookings: true
        }
      }
    }
  })

  res.json({
    success: true,
    data: stores
  })
})