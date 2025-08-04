'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuth } from '../hooks/useAuth'
import { useQueryParams } from '@/hooks/useQueryParams'
import styles from './RegisterForm.module.css'

const registerCustomerSchema = z.object({
  name: z.string().min(1, 'お名前を入力してください'),
  email: z.string().email('正しいメールアドレスを入力してください'),
  password: z.string().min(6, 'パスワードは6文字以上で入力してください'),
  passwordConfirm: z.string(),
  storeCode: z.string().length(6, '店舗コードは6文字で入力してください'),
  phone: z.string().optional(),
  gender: z.enum(['male', 'female', '']).optional(),
  birthday: z.string().optional(),
}).refine((data) => data.password === data.passwordConfirm, {
  message: 'パスワードが一致しません',
  path: ['passwordConfirm'],
})

type RegisterCustomerFormData = z.infer<typeof registerCustomerSchema>

export const RegisterCustomerForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { registerCustomer } = useAuth()
  const { storeCode } = useQueryParams()
  const hasStoreCodeFromQR = !!storeCode

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterCustomerFormData>({
    resolver: zodResolver(registerCustomerSchema),
  })

  useEffect(() => {
    if (hasStoreCodeFromQR) {
      setValue('storeCode', storeCode)
    }
  }, [hasStoreCodeFromQR, storeCode, setValue])

  const onSubmit = async (data: RegisterCustomerFormData) => {
    setIsLoading(true)
    setError('')

    try {
      const { passwordConfirm, ...registerData } = data
      const formattedData = {
        ...registerData,
        gender: registerData.gender === '' ? undefined : registerData.gender,
      }
      await registerCustomer(formattedData as any)
    } catch (error: any) {
      setError(error.response?.data?.message || '登録に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <h2 className={styles.title}>お客様新規登録</h2>

      {hasStoreCodeFromQR && (
        <div className={styles.storeInfo}>
          店舗コード: {storeCode} で登録します
        </div>
      )}

      {error && <div className={styles.error}>{error}</div>}

      <Input
        label="お名前"
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

      {!hasStoreCodeFromQR && (
        <Input
          label="店舗コード"
          {...register('storeCode')}
          error={errors.storeCode?.message}
          placeholder="例: ABC123"
          fullWidth
        />
      )}

      {hasStoreCodeFromQR && (
        <input type="hidden" {...register('storeCode')} value={storeCode} />
      )}

      <Input
        label="電話番号（任意）"
        type="tel"
        {...register('phone')}
        error={errors.phone?.message}
        fullWidth
      />

      <div className={styles.genderField}>
        <label className={styles.label}>性別（任意）</label>
        <select {...register('gender')} className={styles.select}>
          <option value="">選択してください</option>
          <option value="male">男性</option>
          <option value="female">女性</option>
        </select>
      </div>

      <Input
        label="生年月日（任意）"
        type="date"
        {...register('birthday')}
        error={errors.birthday?.message}
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