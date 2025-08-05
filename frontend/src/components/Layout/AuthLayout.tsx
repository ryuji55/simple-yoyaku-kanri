import React from 'react';
import styles from './AuthLayout.module.scss';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className={styles.container}>
      <div className={styles.background}>
        <div className={styles.backgroundShape1} />
        <div className={styles.backgroundShape2} />
        <div className={styles.backgroundShape3} />
      </div>
      
      <div className={styles.content}>
        <div className={styles.logoContainer}>
          <h2 className={styles.logo}>Simple Yoyaku Kanri</h2>
          <p className={styles.tagline}>シンプルで使いやすい予約管理システム</p>
        </div>
        
        <div className={styles.formContainer}>
          {children}
        </div>
      </div>
    </div>
  );
};