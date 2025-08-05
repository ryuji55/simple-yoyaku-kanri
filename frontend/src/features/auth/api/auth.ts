import { apiClient, ApiResponse } from '@/lib/axios';
import { AuthResponse, LoginCredentials, RegisterCredentials, User } from '@/types/auth';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
    return response.data.data!;
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/admin/register', credentials);
    return response.data.data!;
  },

  getMe: async (): Promise<User> => {
    const response = await apiClient.get<ApiResponse<{ user: User }>>('/admin/me');
    return response.data.data!.user;
  },

  logout: async (): Promise<void> => {
    // Just remove the token client-side for now
    // In the future, you might want to add a server-side logout endpoint
    return Promise.resolve();
  },
};