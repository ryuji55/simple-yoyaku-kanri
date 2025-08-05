import {
  Router,
  type Request,
  type Response,
  type NextFunction,
} from 'express';
import type { LoginInput } from '../../types';
import { LoginUseCase } from '../../useCases/auth/loginUseCase';

const router = Router();

// Login endpoint
router.post(
  '/login',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const loginUseCase = new LoginUseCase();
      const input: LoginInput = {
        email: req.body.email,
        password: req.body.password,
      };

      const result = await loginUseCase.execute(input);

      res.json({
        success: true,
        data: {
          admin: result.admin,
          token: result.token,
        },
      });
    } catch (error) {
      next(error);
    }
  },
);

export default router;
