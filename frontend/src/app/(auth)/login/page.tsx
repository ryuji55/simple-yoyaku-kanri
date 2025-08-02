'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import { Button, Input, Card } from '@/components'
import { authService } from '@/services/auth'
import { useAuth } from '@/contexts/AuthContext'
import styles from './page.module.css'

type LoginForm = {
  email: string
  password: string
}

type UserRole = 'customer' | 'store' | 'admin'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [role, setRole] = useState<UserRole>('customer')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>()

  const onSubmit = async (data: LoginForm) => {
    setError('')
    setLoading(true)

    try {
      let response
      switch (role) {
        case 'admin':
          response = await authService.loginAdmin(data.email, data.password)
          break
        case 'store':
          response = await authService.loginStore(data.email, data.password)
          break
        case 'customer':
          response = await authService.loginCustomer(data.email, data.password)
          break
      }

      login(response.token, response.user)
      
      switch (response.user.role) {
        case 'admin':
          router.push('/admin')
          break
        case 'store':
          router.push('/store')
          break
        case 'customer':
          router.push('/customer')
          break
      }
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'ログインに失敗しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <h1 className={styles.title}>ログイン</h1>
        
        <div className={styles.roleSelector}>
          <button
            className={`${styles.roleButton} ${role === 'customer' ? styles.active : ''}`}
            onClick={() => setRole('customer')}
          >
            お客様
          </button>
          <button
            className={`${styles.roleButton} ${role === 'store' ? styles.active : ''}`}
            onClick={() => setRole('store')}
          >
            店舗
          </button>
          <button
            className={`${styles.roleButton} ${role === 'admin' ? styles.active : ''}`}
            onClick={() => setRole('admin')}
          >
            管理者
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <Input
            type="email"
            label="メールアドレス"
            fullWidth
            {...register('email', {
              required: 'メールアドレスを入力してください',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: '有効なメールアドレスを入力してください',
              },
            })}
            error={errors.email?.message}
          />

          <Input
            type="password"
            label="パスワード"
            fullWidth
            {...register('password', {
              required: 'パスワードを入力してください',
              minLength: {
                value: 6,
                message: 'パスワードは6文字以上で入力してください',
              },
            })}
            error={errors.password?.message}
          />

          {error && <div className={styles.error}>{error}</div>}

          <Button type="submit" fullWidth loading={loading}>
            ログイン
          </Button>
        </form>

        {role === 'customer' && (
          <p className={styles.register}>
            アカウントをお持ちでない方は
            <Link href="/register/customer" className={styles.link}>
              新規登録
            </Link>
          </p>
        )}
        
        {role === 'store' && (
          <p className={styles.register}>
            店舗登録がまだの方は
            <Link href="/register/store" className={styles.link}>
              店舗登録
            </Link>
          </p>
        )}
      </Card>
    </div>
  )
}