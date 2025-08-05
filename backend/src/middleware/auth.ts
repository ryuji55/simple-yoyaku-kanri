import type { NextFunction, Request, Response } from 'express';
import { AuthService } from '../services/authService';
import type { JwtPayload } from '../types';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

const authService = new AuthService();

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: {
          message: '認証トークンが必要です',
        },
      });
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    try {
      const decoded = authService.verifyToken(token);
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        error: {
          message: '無効なトークンです',
        },
      });
      return;
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: '認証エラーが発生しました',
      },
    });
  }
};

// Middleware to check if user is admin
export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({
      success: false,
      error: {
        message: '管理者権限が必要です',
      },
    });
    return;
  }
  next();
};

// Middleware to check specific roles (for future use)
export const requireRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: {
          message: 'アクセス権限がありません',
        },
      });
      return;
    }
    next();
  };
};
