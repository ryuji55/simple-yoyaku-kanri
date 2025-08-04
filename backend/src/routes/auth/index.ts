import { Router, Request, Response, NextFunction } from 'express';
import { LoginUseCase } from '../../useCases/auth/loginUseCase';
import { LoginInput } from '../../types';

const router = Router();

// Login endpoint
router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const loginUseCase = new LoginUseCase();
    const input: LoginInput = {
      email: req.body.email,
      password: req.body.password
    };

    const result = await loginUseCase.execute(input);

    res.json({
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

export default router;