import type { NextFunction, Request, Response } from 'express';
import { env } from '../config/env.validation';

export interface ApiError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Log error details in development
  if (env.isDevelopment) {
    console.error('Error:', err);
  }

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(env.isDevelopment && { stack: err.stack }),
    },
  });
};
