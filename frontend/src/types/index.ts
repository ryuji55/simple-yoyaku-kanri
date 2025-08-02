export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'store' | 'customer'
  storeId?: string
  storeName?: string
}

export interface Store {
  id: string
  name: string
  email: string
  phone: string
  is_active: boolean
  cancel_deadline_hour: number
  online_booking_deadline_minute: number
  max_reservation_month_ahead: number
  created_at: string
  updated_at: string
  _count?: {
    staffs: number
    customers: number
    menus: number
    bookings: number
  }
}

export interface Staff {
  id: string
  store_id: string
  name: string
  email: string
  profile?: string
  role: 'owner' | 'staff'
  gender?: 'male' | 'female' | 'other'
  birthday?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Customer {
  id: string
  store_id: string
  name: string
  email: string
  phone: string
  gender?: 'male' | 'female' | 'other'
  birthday?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Menu {
  id: string
  store_id: string
  name: string
  description?: string
  duration_min: number
  price: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Booking {
  id: string
  store_id: string
  customer_id: string
  staff_id: string
  start_time: string
  end_time: string
  status: 'reserved' | 'canceled' | 'no_show' | 'completed'
  note?: string
  is_active: boolean
  created_at: string
  updated_at: string
  customer?: Customer
  staff?: Staff
  menus?: Menu[]
}

export interface AuthResponse {
  success: boolean
  token: string
  user: User
}

export interface ErrorResponse {
  success: false
  error: {
    message: string
  }
}