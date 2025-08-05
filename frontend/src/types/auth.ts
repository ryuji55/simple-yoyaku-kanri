export interface User {
  id: string;
  email: string;
  role: 'admin' | 'store' | 'staff' | 'customer';
}

export interface Admin {
  id: string;
  email: string;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  admin: Admin;
  token: string;
}