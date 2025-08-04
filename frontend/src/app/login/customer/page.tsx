'use client'

import { LoginForm } from '@/features/auth/components/LoginForm'
import Link from 'next/link'
import styles from '../page.module.css'

export default function CustomerLoginPage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.logo}>Simple 予約管理</h1>
        <h2 className={styles.subtitle}>お客様ログイン</h2>
        
        <LoginForm role="customer" />

        <p className={styles.registerLink}>
          アカウントをお持ちでない方は
          <Link href="/register/customer">新規登録</Link>
        </p>
      </div>
    </div>
  )
}