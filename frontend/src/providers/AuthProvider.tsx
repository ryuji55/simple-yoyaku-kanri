'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { User, LoginCredentials, RegisterCredentials } from '@/types/auth';
import { authApi } from '@/features/auth/api/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      const token = Cookies.get('auth-token');
      if (!token) {
        setUser(null);
        return;
      }

      const userData = await authApi.getMe();
      setUser(userData);
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
      Cookies.remove('auth-token');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await authApi.login(credentials);
      Cookies.set('auth-token', response.token, { expires: 7 });
      
      // Extract user info from admin response
      const user: User = {
        id: response.admin.id,
        email: response.admin.email,
        role: 'admin',
      };
      setUser(user);
      router.push('/dashboard');
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'ログインに失敗しました';
      throw new Error(message);
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      const response = await authApi.register(credentials);
      Cookies.set('auth-token', response.token, { expires: 7 });
      
      // Extract user info from admin response
      const user: User = {
        id: response.admin.id,
        email: response.admin.email,
        role: 'admin',
      };
      setUser(user);
      router.push('/dashboard');
    } catch (error: any) {
      const message = error.response?.data?.error?.message || '登録に失敗しました';
      throw new Error(message);
    }
  };

  const logout = async () => {
    await authApi.logout();
    Cookies.remove('auth-token');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};