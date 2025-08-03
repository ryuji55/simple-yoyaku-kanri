export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

export const API_ENDPOINTS = {
  auth: {
    login: {
      admin: '/auth/login/admin',
      store: '/auth/login/store',
      customer: '/auth/login/customer',
    },
    register: {
      store: '/auth/register/store',
      customer: '/auth/register/customer',
    },
  },
} as const