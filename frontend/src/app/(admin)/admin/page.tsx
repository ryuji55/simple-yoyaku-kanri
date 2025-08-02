'use client'

import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components'
import styles from './page.module.css'

export default function AdminDashboard() {
  const { user, logout } = useAuth()

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>管理者ダッシュボード</h1>
        <Button onClick={logout} variant="secondary" size="small">
          ログアウト
        </Button>
      </header>
      
      <main className={styles.main}>
        <p>ようこそ、{user?.email}さん</p>
        <p>管理者機能は現在開発中です。</p>
      </main>
    </div>
  )
}