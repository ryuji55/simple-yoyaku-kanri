'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuth } from '../hooks/useAuth'
import { UserRole } from '../types'
import styles from './LoginForm.module.css'

const loginSchema = z.object({
  email: z.string().email('正しいメールアドレスを入力してください'),
  password: z.string().min(6, 'パスワードは6文字以上で入力してください'),
  storeCode: z.string().length(6, '店舗コードは6文字で入力してください').optional(),
})

type LoginFormData = z.infer<typeof loginSchema>

interface LoginFormProps {
  role: UserRole
}

export const LoginForm: React.FC<LoginFormProps> = ({ role }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setError('')

    try {
      await login(role, data)
    } catch (error: any) {
      setError(error.response?.data?.message || 'ログインに失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  const getRoleLabel = () => {
    switch (role) {
      case 'admin':
        return '管理者'
      case 'store':
        return '店舗'
      case 'customer':
        return 'お客様'
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <h2 className={styles.title}>{getRoleLabel()}ログイン</h2>

      {error && <div className={styles.error}>{error}</div>}

      <Input
        label="メールアドレス"
        type="email"
        {...register('email')}
        error={errors.email?.message}
        fullWidth
      />

      <Input
        label="パスワード"
        type="password"
        {...register('password')}
        error={errors.password?.message}
        fullWidth
      />

      {role === 'customer' && (
        <Input
          label="店舗コード"
          {...register('storeCode')}
          error={errors.storeCode?.message}
          placeholder="例: ABC123"
          fullWidth
        />
      )}

      <Button type="submit" fullWidth disabled={isLoading}>
        {isLoading ? 'ログイン中...' : 'ログイン'}
      </Button>
    </form>
  )
}