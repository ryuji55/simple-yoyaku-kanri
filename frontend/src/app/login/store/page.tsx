'use client'

import { LoginForm } from '@/features/auth/components/LoginForm'
import Link from 'next/link'
import styles from '../page.module.css'

export default function StoreLoginPage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.logo}>Simple 予約管理</h1>
        <h2 className={styles.subtitle}>店舗ログイン</h2>
        
        <LoginForm role="store" />

        <p className={styles.registerLink}>
          店舗の新規登録は
          <Link href="/register/store">こちら</Link>
        </p>
      </div>
    </div>
  )
}