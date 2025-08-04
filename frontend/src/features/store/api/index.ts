import { apiClient } from '@/lib/axios'

export interface StoreQRCodeResponse {
  success: boolean
  qrCodeImage: string
  loginUrl: string
  registerUrl: string
  shortUrl: string
}

export const storeApi = {
  getQRCode: async (storeId: string): Promise<StoreQRCodeResponse> => {
    const response = await apiClient.get<StoreQRCodeResponse>(
      `/stores/${storeId}/qrcode`
    )
    return response.data
  },
}