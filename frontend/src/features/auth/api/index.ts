import { apiClient } from '@/lib/axios'
import { API_ENDPOINTS } from '@/config/api'
import {
  LoginDto,
  RegisterStoreDto,
  RegisterCustomerDto,
  AuthResponse,
  UserRole,
} from '../types'

export const authApi = {
  login: async (role: UserRole, data: LoginDto): Promise<AuthResponse> => {
    const endpoint = API_ENDPOINTS.auth.login[role]
    const response = await apiClient.post<AuthResponse>(endpoint, data)
    return response.data
  },

  registerStore: async (data: RegisterStoreDto): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.auth.register.store,
      data
    )
    return response.data
  },

  registerCustomer: async (data: RegisterCustomerDto): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.auth.register.customer,
      data
    )
    return response.data
  },
}