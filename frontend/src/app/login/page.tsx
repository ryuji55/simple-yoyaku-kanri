import Link from 'next/link'
import styles from './page.module.css'

export default function LoginLandingPage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.logo}>Simple 予約管理</h1>
        
        <div className={styles.roleSelection}>
          <h2 className={styles.subtitle}>ログイン方法を選択してください</h2>
          
          <div className={styles.roleButtons}>
            <Link href="/login/customer" className={styles.roleButton}>
              <span className={styles.roleIcon}>👤</span>
              <span className={styles.roleTitle}>お客様</span>
              <span className={styles.roleDescription}>予約の確認・新規予約</span>
            </Link>
            
            <Link href="/login/store" className={styles.roleButton}>
              <span className={styles.roleIcon}>🏪</span>
              <span className={styles.roleTitle}>店舗スタッフ</span>
              <span className={styles.roleDescription}>予約管理・スケジュール管理</span>
            </Link>
            
            <Link href="/login/admin" className={styles.roleButton}>
              <span className={styles.roleIcon}>⚙️</span>
              <span className={styles.roleTitle}>管理者</span>
              <span className={styles.roleDescription}>システム管理</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}