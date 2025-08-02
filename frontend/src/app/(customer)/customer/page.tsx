'use client'

import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components'
import styles from './page.module.css'

export default function CustomerDashboard() {
  const { user, logout } = useAuth()

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>{user?.storeName} - 予約管理</h1>
        <Button onClick={logout} variant="secondary" size="small">
          ログアウト
        </Button>
      </header>
      
      <main className={styles.main}>
        <p>ようこそ、{user?.name}さん</p>
        <p>予約機能は現在開発中です。</p>
      </main>
    </div>
  )
}