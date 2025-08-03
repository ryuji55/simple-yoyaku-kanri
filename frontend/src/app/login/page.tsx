'use client'

import { useState } from 'react'
import { LoginForm } from '@/features/auth/components/LoginForm'
import { UserRole } from '@/features/auth/types'
import Link from 'next/link'
import styles from './page.module.css'

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer')

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.logo}>Simple 予約管理</h1>
        
        <div className={styles.roleTabs}>
          <button
            className={`${styles.roleTab} ${selectedRole === 'customer' ? styles.active : ''}`}
            onClick={() => setSelectedRole('customer')}
          >
            お客様
          </button>
          <button
            className={`${styles.roleTab} ${selectedRole === 'store' ? styles.active : ''}`}
            onClick={() => setSelectedRole('store')}
          >
            店舗
          </button>
          <button
            className={`${styles.roleTab} ${selectedRole === 'admin' ? styles.active : ''}`}
            onClick={() => setSelectedRole('admin')}
          >
            管理者
          </button>
        </div>

        <LoginForm role={selectedRole} />

        {selectedRole === 'customer' && (
          <p className={styles.registerLink}>
            アカウントをお持ちでない方は
            <Link href="/register/customer">新規登録</Link>
          </p>
        )}

        {selectedRole === 'store' && (
          <p className={styles.registerLink}>
            店舗の新規登録は
            <Link href="/register/store">こちら</Link>
          </p>
        )}
      </div>
    </div>
  )
}