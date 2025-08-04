'use client'

import { useState, useEffect } from 'react'
import { storeApi } from '../api'
import { Button } from '@/components/ui/Button'
import styles from './QRCodeDisplay.module.css'

interface QRCodeDisplayProps {
  storeId: string
  storeName: string
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ storeId, storeName }) => {
  const [qrCodeData, setQrCodeData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)

  useEffect(() => {
    const fetchQRCode = async () => {
      try {
        const data = await storeApi.getQRCode(storeId)
        setQrCodeData(data)
      } catch (err) {
        setError('QRコードの取得に失敗しました')
      } finally {
        setIsLoading(false)
      }
    }

    fetchQRCode()
  }, [storeId])

  const copyToClipboard = async (url: string, type: string) => {
    try {
      await navigator.clipboard.writeText(url)
      setCopiedUrl(type)
      setTimeout(() => setCopiedUrl(null), 2000)
    } catch (err) {
      console.error('コピーに失敗しました', err)
    }
  }

  const downloadQRCode = () => {
    if (!qrCodeData) return

    const link = document.createElement('a')
    link.download = `${storeName}_QRコード.png`
    link.href = qrCodeData.qrCodeImage
    link.click()
  }

  const shareOnLine = () => {
    if (!qrCodeData) return
    
    const message = encodeURIComponent(
      `${storeName}の予約はこちらから！\n${qrCodeData.shortUrl}`
    )
    window.open(`https://line.me/R/msg/text/?${message}`, '_blank')
  }

  const shareByEmail = () => {
    if (!qrCodeData) return
    
    const subject = encodeURIComponent(`${storeName}の予約について`)
    const body = encodeURIComponent(
      `${storeName}の予約はこちらから行えます。\n\nログイン: ${qrCodeData.loginUrl}\n新規登録: ${qrCodeData.registerUrl}\n\nまたは、こちらの短縮URLをクリックしてください: ${qrCodeData.shortUrl}`
    )
    window.location.href = `mailto:?subject=${subject}&body=${body}`
  }

  if (isLoading) return <div className={styles.loading}>読み込み中...</div>
  if (error) return <div className={styles.error}>{error}</div>
  if (!qrCodeData) return null

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>QRコード・共有リンク</h3>
      
      <div className={styles.qrCodeSection}>
        <img 
          src={qrCodeData.qrCodeImage} 
          alt="QRコード"
          className={styles.qrCode}
        />
        <Button onClick={downloadQRCode} variant="outline" size="sm">
          QRコードをダウンロード
        </Button>
      </div>

      <div className={styles.urlSection}>
        <div className={styles.urlItem}>
          <label>短縮URL:</label>
          <div className={styles.urlContainer}>
            <input 
              type="text" 
              value={qrCodeData.shortUrl} 
              readOnly 
              className={styles.urlInput}
            />
            <Button 
              onClick={() => copyToClipboard(qrCodeData.shortUrl, 'short')}
              variant="outline"
              size="sm"
            >
              {copiedUrl === 'short' ? 'コピーしました！' : 'コピー'}
            </Button>
          </div>
        </div>

        <div className={styles.urlItem}>
          <label>ログインURL:</label>
          <div className={styles.urlContainer}>
            <input 
              type="text" 
              value={qrCodeData.loginUrl} 
              readOnly 
              className={styles.urlInput}
            />
            <Button 
              onClick={() => copyToClipboard(qrCodeData.loginUrl, 'login')}
              variant="outline"
              size="sm"
            >
              {copiedUrl === 'login' ? 'コピーしました！' : 'コピー'}
            </Button>
          </div>
        </div>

        <div className={styles.urlItem}>
          <label>新規登録URL:</label>
          <div className={styles.urlContainer}>
            <input 
              type="text" 
              value={qrCodeData.registerUrl} 
              readOnly 
              className={styles.urlInput}
            />
            <Button 
              onClick={() => copyToClipboard(qrCodeData.registerUrl, 'register')}
              variant="outline"
              size="sm"
            >
              {copiedUrl === 'register' ? 'コピーしました！' : 'コピー'}
            </Button>
          </div>
        </div>
      </div>

      <div className={styles.shareButtons}>
        <Button onClick={shareOnLine} variant="primary" size="md">
          LINEで共有
        </Button>
        <Button onClick={shareByEmail} variant="secondary" size="md">
          メールで共有
        </Button>
      </div>
    </div>
  )
}