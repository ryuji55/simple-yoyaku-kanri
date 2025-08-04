'use client'

import { useEffect, useState } from 'react'
import { QRCodeDisplay } from '@/features/store/components/QRCodeDisplay'
import styles from './page.module.css'

// 仮の店舗情報（実際はログイン情報から取得）
const mockStoreData = {
  id: '',
  name: '',
  qrCode: ''
}

export default function StoreManagementPage() {
  const [storeData, setStoreData] = useState(mockStoreData)

  useEffect(() => {
    // 実際はログイン情報から店舗情報を取得
    const token = localStorage.getItem('token')
    if (token) {
      // JWTトークンをデコードして店舗情報を取得する処理
      // ここでは仮のデータを設定
      const userStr = localStorage.getItem('user')
      if (userStr) {
        const user = JSON.parse(userStr)
        setStoreData({
          id: user.storeId || '',
          name: user.storeName || 'テスト店舗',
          qrCode: ''
        })
      }
    }
  }, [])

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>店舗管理画面</h1>
        <p className={styles.storeName}>{storeData.name}</p>
      </header>

      <main className={styles.main}>
        <section className={styles.section}>
          <QRCodeDisplay 
            storeId={storeData.id} 
            storeName={storeData.name}
          />
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>予約管理</h2>
          <p>予約管理機能は今後実装予定です。</p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>スタッフ管理</h2>
          <p>スタッフ管理機能は今後実装予定です。</p>
        </section>
      </main>
    </div>
  )
}