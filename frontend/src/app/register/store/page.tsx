import { RegisterStoreForm } from '@/features/auth/components/RegisterStoreForm'
import Link from 'next/link'
import styles from '../page.module.css'

export default function RegisterStorePage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.logo}>Simple 予約管理</h1>
        
        <RegisterStoreForm />

        <p className={styles.loginLink}>
          すでにアカウントをお持ちの方は
          <Link href="/login">ログイン</Link>
        </p>
      </div>
    </div>
  )
}