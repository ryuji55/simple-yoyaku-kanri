'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/providers/AuthProvider';
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
    <div className={styles.container}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.formHeader}>
          <div className={styles.systemTitle}>シンプルで使いやすい予約管理システム</div>
          <h1 className={styles.title}>ログイン</h1>
          <p className={styles.subtitle}>管理画面にアクセス</p>
        </div>

        {error && (
          <div className={styles.errorAlert}>
            {error}
          </div>
        )}

        <div className={styles.formFields}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.inputLabel}>メールアドレス</label>
            <input
              {...register('email')}
              id="email"
              type="email"
              className={styles.inputField}
              placeholder="admin@example.com"
              autoComplete="email"
            />
            {errors.email && (
              <div className={styles.inputError}>
                ✗ {errors.email.message}
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.inputLabel}>パスワード</label>
            <input
              {...register('password')}
              id="password"
              type="password"
              className={styles.inputField}
              placeholder="••••••••"
              autoComplete="current-password"
            />
            {errors.password && (
              <div className={styles.inputError}>
                ✗ {errors.password.message}
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          className={styles.submitButton}
          disabled={loading}
        >
          {loading ? 'ログイン中...' : 'ログイン'}
        </button>

        <div className={styles.formFooter}>
          アカウントをお持ちでない方は{' '}
          <a href="/register" className={styles.link}>
            新規登録
          </a>
        </div>
      </form>
    </div>
  );
};