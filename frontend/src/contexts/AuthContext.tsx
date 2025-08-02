'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User } from '@/types'
import { authService } from '@/services/auth'
import { jwtDecode } from 'jwt-decode'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (token: string, user: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = authService.getToken()
    if (token) {
      try {
        const decoded = jwtDecode<any>(token)
        if (decoded.exp * 1000 > Date.now()) {
          setUser({
            id: decoded.id,
            email: decoded.email || '',
            name: decoded.name || '',
            role: decoded.role,
            storeId: decoded.storeId,
            storeName: decoded.storeName,
          })
        } else {
          authService.logout()
        }
      } catch (error) {
        console.error('Invalid token:', error)
        authService.logout()
      }
    }
    setLoading(false)
  }, [])

  const login = (token: string, user: User) => {
    authService.setToken(token)
    setUser(user)
  }

  const logout = () => {
    authService.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}