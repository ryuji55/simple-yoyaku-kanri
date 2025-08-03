import { Request, Response, NextFunction } from 'express'
import { AppError } from '../../shared/errors/AppError'

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        message: err.message
      }
    })
  }

  console.error('Unexpected error:', err)

  res.status(500).json({
    success: false,
    error: {
      message: 'Internal Server Error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  })
}