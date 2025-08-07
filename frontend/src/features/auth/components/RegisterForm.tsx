'use client';

import React, { useState, useCallback } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/providers/AuthProvider';
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
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, text: '', color: '' });

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
    control,
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
  });

  const watchedEmail = useWatch({ control, name: 'email' });
  const watchedConfirmEmail = useWatch({ control, name: 'confirmEmail' });
  const watchedPassword = useWatch({ control, name: 'password' });
  const watchedConfirmPassword = useWatch({ control, name: 'confirmPassword' });

  // パスワード強度チェック関数
  const checkPasswordStrength = useCallback((password: string) => {
    if (!password) {
      return { score: 0, text: '', color: '' };
    }

    let score = 0;
    const feedback = [];

    if (password.length >= 8) score += 25;
    else feedback.push('8文字以上');

    if (/[a-z]/.test(password)) score += 25;
    else feedback.push('小文字');

    if (/[A-Z]/.test(password)) score += 25;
    else feedback.push('大文字');

    if (/[0-9!@#$%^&*]/.test(password)) score += 25;
    else feedback.push('数字または特殊文字');

    let text = '';
    let color = '';

    if (score < 50) {
      text = `弱い - 必要: ${feedback.join(', ')}`;
      color = '#e53e3e';
    } else if (score < 75) {
      text = '普通';
      color = '#d69e2e';
    } else {
      text = '強い';
      color = '#38a169';
    }

    return { score, text, color };
  }, []);

  // パスワード変更時の処理
  React.useEffect(() => {
    if (watchedPassword) {
      const strength = checkPasswordStrength(watchedPassword);
      setPasswordStrength(strength);
    } else {
      setPasswordStrength({ score: 0, text: '', color: '' });
    }
  }, [watchedPassword, checkPasswordStrength]);

  // メール一致チェック
  const emailsMatch = watchedEmail && watchedConfirmEmail && watchedEmail === watchedConfirmEmail;
  const emailsDontMatch = watchedConfirmEmail && watchedEmail !== watchedConfirmEmail;

  // パスワード一致チェック
  const passwordsMatch = watchedPassword && watchedConfirmPassword && watchedPassword === watchedConfirmPassword;
  const passwordsDontMatch = watchedConfirmPassword && watchedPassword !== watchedConfirmPassword;

  // 送信ボタンの有効性チェック
  const isFormValid = emailsMatch && passwordsMatch && passwordStrength.score >= 50 && !Object.keys(errors).length;

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
    <div className={styles.container}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.formHeader}>
          <div className={styles.systemTitle}>シンプルで使いやすい予約管理システム</div>
          <h1 className={styles.title}>管理者登録</h1>
          <p className={styles.subtitle}>システム管理者アカウントの作成</p>
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
              {...formRegister('email')}
              id="email"
              type="email"
              className={styles.inputField}
              placeholder="admin@example.com"
              autoComplete="email"
            />
            <div className={styles.inputHint}>
              <svg className={styles.icon} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
              </svg>
              予約通知やパスワード再設定に使用されます
            </div>
            {errors.email && (
              <div className={styles.inputError}>
                ✗ {errors.email.message}
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmEmail" className={styles.inputLabel}>メールアドレス確認</label>
            <input
              {...formRegister('confirmEmail')}
              id="confirmEmail"
              type="email"
              className={`${styles.inputField} ${
                emailsDontMatch ? styles.error : emailsMatch ? styles.success : ''
              }`}
              placeholder="admin@example.com"
              autoComplete="email"
            />
            {watchedConfirmEmail && (
              <div className={`${styles.matchStatus} ${
                emailsMatch ? styles.success : emailsDontMatch ? styles.error : styles.hidden
              }`}>
                {emailsMatch ? '✓ メールアドレスが一致しています' : '✗ メールアドレスが一致しません'}
              </div>
            )}
            {errors.confirmEmail && (
              <div className={styles.inputError}>
                ✗ {errors.confirmEmail.message}
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.inputLabel}>パスワード</label>
            <input
              {...formRegister('password')}
              id="password"
              type="password"
              className={styles.inputField}
              placeholder="••••••••"
              autoComplete="new-password"
            />
            {watchedPassword && (
              <div className={styles.passwordStrength}>
                <div className={styles.strengthBar}>
                  <div 
                    className={styles.strengthFill}
                    style={{
                      width: `${passwordStrength.score}%`,
                      backgroundColor: passwordStrength.color
                    }}
                  ></div>
                </div>
                <div 
                  className={styles.strengthText}
                  style={{ color: passwordStrength.color }}
                >
                  {passwordStrength.text}
                </div>
              </div>
            )}
            {errors.password && (
              <div className={styles.inputError}>
                ✗ {errors.password.message}
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword" className={styles.inputLabel}>パスワード確認</label>
            <input
              {...formRegister('confirmPassword')}
              id="confirmPassword"
              type="password"
              className={`${styles.inputField} ${
                passwordsDontMatch ? styles.error : passwordsMatch ? styles.success : ''
              }`}
              placeholder="••••••••"
              autoComplete="new-password"
            />
            {watchedConfirmPassword && (
              <div className={`${styles.matchStatus} ${
                passwordsMatch ? styles.success : passwordsDontMatch ? styles.error : styles.hidden
              }`}>
                {passwordsMatch ? '✓ パスワードが一致しています' : '✗ パスワードが一致しません'}
              </div>
            )}
            {errors.confirmPassword && (
              <div className={styles.inputError}>
                ✗ {errors.confirmPassword.message}
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          className={styles.submitButton}
          disabled={loading || !isFormValid}
        >
          {loading ? '登録中...' : '登録'}
        </button>

        <div className={styles.formFooter}>
          既にアカウントをお持ちの方は{' '}
          <a href="/login" className={styles.link}>
            ログイン
          </a>
        </div>
      </form>
    </div>
  );
};