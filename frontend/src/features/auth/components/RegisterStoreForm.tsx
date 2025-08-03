'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuth } from '../hooks/useAuth'
import styles from './RegisterForm.module.css'

const registerStoreSchema = z.object({
  name: z.string().min(1, '店舗名を入力してください'),
  email: z.string().email('正しいメールアドレスを入力してください'),
  password: z.string().min(6, 'パスワードは6文字以上で入力してください'),
  passwordConfirm: z.string(),
  phone: z.string().min(1, '電話番号を入力してください'),
  ownerName: z.string().min(1, 'オーナー名を入力してください'),
}).refine((data) => data.password === data.passwordConfirm, {
  message: 'パスワードが一致しません',
  path: ['passwordConfirm'],
})

type RegisterStoreFormData = z.infer<typeof registerStoreSchema>

export const RegisterStoreForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { registerStore } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterStoreFormData>({
    resolver: zodResolver(registerStoreSchema),
  })

  const onSubmit = async (data: RegisterStoreFormData) => {
    setIsLoading(true)
    setError('')

    try {
      const { passwordConfirm, ...registerData } = data
      await registerStore(registerData)
    } catch (error: any) {
      setError(error.response?.data?.message || '登録に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <h2 className={styles.title}>店舗新規登録</h2>

      {error && <div className={styles.error}>{error}</div>}

      <Input
        label="店舗名"
        {...register('name')}
        error={errors.name?.message}
        fullWidth
      />

      <Input
        label="メールアドレス"
        type="email"
        {...register('email')}
        error={errors.email?.message}
        fullWidth
      />

      <Input
        label="電話番号"
        type="tel"
        {...register('phone')}
        error={errors.phone?.message}
        fullWidth
      />

      <Input
        label="オーナー名"
        {...register('ownerName')}
        error={errors.ownerName?.message}
        fullWidth
      />

      <Input
        label="パスワード"
        type="password"
        {...register('password')}
        error={errors.password?.message}
        fullWidth
      />

      <Input
        label="パスワード（確認）"
        type="password"
        {...register('passwordConfirm')}
        error={errors.passwordConfirm?.message}
        fullWidth
      />

      <Button type="submit" fullWidth disabled={isLoading}>
        {isLoading ? '登録中...' : '登録する'}
      </Button>
    </form>
  )
}