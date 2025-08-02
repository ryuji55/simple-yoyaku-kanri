'use client'

import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components'
import styles from './page.module.css'

export default function StoreDashboard() {
  const { user, logout } = useAuth()

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>店舗管理画面</h1>
        <Button onClick={logout} variant="secondary" size="small">
          ログアウト
        </Button>
      </header>
      
      <main className={styles.main}>
        <p>ようこそ、{user?.storeName}の{user?.name}さん</p>
        <p>店舗管理機能は現在開発中です。</p>
      </main>
    </div>
  )
}