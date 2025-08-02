import { apiClient } from '@/lib/axios'
import { AuthResponse } from '@/types'
import Cookies from 'js-cookie'

export const authService = {
  async loginAdmin(email: string, password: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login/admin', {
      email,
      password,
    })
    return response.data
  },

  async loginStore(email: string, password: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login/store', {
      email,
      password,
    })
    return response.data
  },

  async loginCustomer(email: string, password: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login/customer', {
      email,
      password,
    })
    return response.data
  },

  async registerStore(data: {
    name: string
    email: string
    password: string
    phone: string
  }): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register/store', data)
    return response.data
  },

  async registerCustomer(data: {
    storeId: string
    name: string
    email: string
    password: string
    phone: string
    gender?: 'male' | 'female' | 'other'
    birthday?: string
  }): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register/customer', data)
    return response.data
  },

  logout() {
    Cookies.remove('token')
    window.location.href = '/login'
  },

  setToken(token: string) {
    Cookies.set('token', token, { expires: 7 })
  },

  getToken() {
    return Cookies.get('token')
  },

  isAuthenticated() {
    return !!this.getToken()
  },
}