export interface AuthRequest {
  email: string
  password: string
}

export interface RegisterStoreRequest {
  name: string
  email: string
  password: string
  phone: string
}

export interface RegisterCustomerRequest {
  storeId: string
  name: string
  email: string
  password: string
  phone: string
  gender?: 'male' | 'female' | 'other'
  birthday?: string
}

export interface RegisterStaffRequest {
  storeId: string
  name: string
  email: string
  password: string
  role: 'owner' | 'staff'
  gender?: 'male' | 'female' | 'other'
  birthday?: string
}