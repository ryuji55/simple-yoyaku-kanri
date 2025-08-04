export type UserRole = 'admin' | 'store' | 'customer'

export interface LoginDto {
  email: string
  password: string
  storeCode?: string
}

export interface RegisterStoreDto {
  name: string
  email: string
  password: string
  phone: string
  ownerName: string
}

export interface RegisterCustomerDto {
  name: string
  email: string
  password: string
  storeCode: string
  phone?: string
  gender?: 'male' | 'female'
  birthday?: string
}

export interface AuthResponse {
  success: boolean
  token: string
  user: {
    id: string
    email: string
    role: UserRole
    storeId?: string
  }
}

export interface AuthState {
  user: AuthResponse['user'] | null
  token: string | null
  isAuthenticated: boolean
}