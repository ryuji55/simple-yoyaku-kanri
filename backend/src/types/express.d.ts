import { Admin, Staff, Customer } from '@prisma/client'

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string
        role: 'admin' | 'store' | 'customer'
        storeId?: string
      }
    }
  }
}