import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { authApi } from '../api'
import {
  LoginDto,
  RegisterStoreDto,
  RegisterCustomerDto,
  UserRole,
  AuthState,
} from '../types'

export const useAuth = () => {
  const router = useRouter()
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
  })

  const login = useCallback(async (role: UserRole, data: LoginDto) => {
    try {
      const response = await authApi.login(role, data)
      const { token, user } = response

      localStorage.setItem('token', token)
      setAuthState({
        user,
        token,
        isAuthenticated: true,
      })

      // Redirect based on role
      switch (role) {
        case 'admin':
          router.push('/admin')
          break
        case 'store':
          router.push('/store')
          break
        case 'customer':
          router.push('/bookings')
          break
      }

      return response
    } catch (error) {
      throw error
    }
  }, [router])

  const registerStore = useCallback(async (data: RegisterStoreDto) => {
    try {
      const response = await authApi.registerStore(data)
      const { token, user } = response

      localStorage.setItem('token', token)
      setAuthState({
        user,
        token,
        isAuthenticated: true,
      })

      router.push('/store')
      return response
    } catch (error) {
      throw error
    }
  }, [router])

  const registerCustomer = useCallback(async (data: RegisterCustomerDto) => {
    try {
      const response = await authApi.registerCustomer(data)
      const { token, user } = response

      localStorage.setItem('token', token)
      setAuthState({
        user,
        token,
        isAuthenticated: true,
      })

      router.push('/bookings')
      return response
    } catch (error) {
      throw error
    }
  }, [router])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
    })
    router.push('/login')
  }, [router])

  return {
    ...authState,
    login,
    registerStore,
    registerCustomer,
    logout,
  }
}