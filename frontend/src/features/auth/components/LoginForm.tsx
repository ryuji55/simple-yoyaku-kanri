'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/providers/AuthProvider';
import { Button } from '@/components/Elements/Button';
import { Input } from '@/components/Elements/Input';
import styles from './AuthForm.module.scss';

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'メールアドレスは必須です')
    .email('メールアドレスの形式が正しくありません'),
  password: z
    .string()
    .min(1, 'パスワードは必須です'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError('');
      setLoading(true);
      await login(data);
    } catch (err: any) {
      setError(err.message || 'ログインに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className={styles.formHeader}>
        <h1 className={styles.title}>ログイン</h1>
        <p className={styles.subtitle}>管理画面にアクセス</p>
      </div>

      {error && (
        <div className={styles.errorAlert}>
          {error}
        </div>
      )}

      <div className={styles.formFields}>
        <Input
          {...register('email')}
          type="email"
          label="メールアドレス"
          placeholder="admin@example.com"
          error={errors.email?.message}
          autoComplete="email"
        />

        <Input
          {...register('password')}
          type="password"
          label="パスワード"
          placeholder="••••••••"
          error={errors.password?.message}
          autoComplete="current-password"
        />
      </div>

      <Button
        type="submit"
        fullWidth
        size="lg"
        loading={loading}
        disabled={loading}
      >
        ログイン
      </Button>

      <div className={styles.formFooter}>
        <p>
          アカウントをお持ちでない方は{' '}
          <a href="/register" className={styles.link}>
            新規登録
          </a>
        </p>
      </div>
    </form>
  );
};