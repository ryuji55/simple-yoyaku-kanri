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
  storeCode: string
  name: string
  email: string
  password: string
  phone?: string
  gender?: string
  birthday?: string
}

export interface AuthResultDto {
  token: string
  user: {
    id: string
    email: string
    name?: string
    role: string
    storeId?: string
    storeName?: string
  }
}