import { RegisterCustomerForm } from '@/features/auth/components/RegisterCustomerForm'
import Link from 'next/link'
import styles from '../page.module.css'

export default function RegisterCustomerPage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.logo}>Simple 予約管理</h1>
        
        <RegisterCustomerForm />

        <p className={styles.loginLink}>
          すでにアカウントをお持ちの方は
          <Link href="/login">ログイン</Link>
        </p>
      </div>
    </div>
  )
}