import { Router, Request, Response, NextFunction } from 'express';
import { RegisterAdminUseCase } from '../../useCases/admin/registerAdminUseCase';
import { CreateAdminInput } from '../../types';
import { authenticate, requireAdmin } from '../../middleware/auth';

const router = Router();

// Admin registration endpoint
router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const registerAdminUseCase = new RegisterAdminUseCase();
    const input: CreateAdminInput = {
      email: req.body.email,
      password: req.body.password
    };

    const result = await registerAdminUseCase.execute(input);

    res.status(201).json({
      success: true,
      data: {
        admin: result.admin,
        token: result.token
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get current admin info (protected route)
router.get('/me', authenticate, requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json({
      success: true,
      data: {
        user: req.user
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;