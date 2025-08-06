'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/providers/AuthProvider';
import { Button } from '@/components/Elements/Button';
import { Input } from '@/components/Elements/Input';
import styles from './AuthForm.module.scss';

const registerSchema = z.object({
  email: z
    .string()
    .min(1, 'メールアドレスは必須です')
    .email('メールアドレスの形式が正しくありません'),
  confirmEmail: z
    .string()
    .min(1, 'メールアドレス確認は必須です')
    .email('メールアドレスの形式が正しくありません'),
  password: z
    .string()
    .min(8, 'パスワードは8文字以上である必要があります')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/,
      'パスワードは大文字、小文字、数字、特殊文字を含む必要があります'
    ),
  confirmPassword: z
    .string()
    .min(1, 'パスワード確認は必須です'),
}).refine((data) => data.email === data.confirmEmail, {
  message: 'メールアドレスが一致しません',
  path: ['confirmEmail'],
}).refine((data) => data.password === data.confirmPassword, {
  message: 'パスワードが一致しません',
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterForm: React.FC = () => {
  const { register } = useAuth();
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setError('');
      setLoading(true);
      await register({
        email: data.email,
        password: data.password,
      });
    } catch (err: any) {
      setError(err.message || '登録に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className={styles.formHeader}>
        <h1 className={styles.title}>管理者登録</h1>
        <p className={styles.subtitle}>システム管理者アカウントの作成</p>
      </div>

      {error && (
        <div className={styles.errorAlert}>
          {error}
        </div>
      )}

      <div className={styles.formFields}>
        <Input
          {...formRegister('email')}
          type="email"
          label="メールアドレス"
          placeholder="admin@example.com"
          error={errors.email?.message}
          autoComplete="email"
        />

        <Input
          {...formRegister('confirmEmail')}
          type="email"
          label="メールアドレス確認"
          placeholder="admin@example.com"
          error={errors.confirmEmail?.message}
          autoComplete="email"
        />

        <Input
          {...formRegister('password')}
          type="password"
          label="パスワード"
          placeholder="••••••••"
          error={errors.password?.message}
          autoComplete="new-password"
        />

        <Input
          {...formRegister('confirmPassword')}
          type="password"
          label="パスワード確認"
          placeholder="••••••••"
          error={errors.confirmPassword?.message}
          autoComplete="new-password"
        />
      </div>

      <Button
        type="submit"
        fullWidth
        size="lg"
        loading={loading}
        disabled={loading}
      >
        登録
      </Button>

      <div className={styles.formFooter}>
        <p>
          既にアカウントをお持ちの方は{' '}
          <a href="/login" className={styles.link}>
            ログイン
          </a>
        </p>
      </div>
    </form>
  );
};