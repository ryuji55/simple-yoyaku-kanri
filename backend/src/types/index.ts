export interface AdminData {
  id: string;
  email: string;
  password?: string;
  is_active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAdminInput {
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface JwtPayload {
  id: string;
  email: string;
  role: 'admin' | 'store' | 'staff' | 'customer';
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}