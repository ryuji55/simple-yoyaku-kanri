import { IStoreRepository } from '../../../domain/repositories/IStoreRepository'
import { NotFoundError } from '../../../shared/errors/AppError'
import QRCode from 'qrcode'

export class GetStoreQRCodeUseCase {
  constructor(
    private storeRepository: IStoreRepository,
    private frontendUrl: string
  ) {}

  async execute(storeId: string): Promise<{
    qrCodeImage: string
    loginUrl: string
    registerUrl: string
    shortUrl: string
  }> {
    const store = await this.storeRepository.findById(storeId)
    if (!store) {
      throw new NotFoundError('店舗が見つかりません')
    }

    if (!store.qrCode) {
      throw new NotFoundError('QRコードが設定されていません')
    }

    const loginUrl = `${this.frontendUrl}/login/customer?store=${store.qrCode}`
    const registerUrl = `${this.frontendUrl}/register/customer?store=${store.qrCode}`
    const shortUrl = `${this.frontendUrl}/s/${store.qrCode}`

    // QRコード画像を生成（データURL形式）
    const qrCodeImage = await QRCode.toDataURL(loginUrl, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    })

    return {
      qrCodeImage,
      loginUrl,
      registerUrl,
      shortUrl
    }
  }
}