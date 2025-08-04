'use client'

import { LoginForm } from '@/features/auth/components/LoginForm'
import styles from '../page.module.css'

export default function AdminLoginPage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.logo}>Simple 予約管理</h1>
        <h2 className={styles.subtitle}>管理者ログイン</h2>
        
        <LoginForm role="admin" />
      </div>
    </div>
  )
}