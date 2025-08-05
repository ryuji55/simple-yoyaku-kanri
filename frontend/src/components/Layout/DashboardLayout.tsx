'use client';

import React from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { Button } from '@/components/Elements/Button';
import styles from './DashboardLayout.module.scss';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logoSection}>
            <h1 className={styles.logo}>Simple Yoyaku Kanri</h1>
          </div>
          
          <nav className={styles.nav}>
            <a href="/dashboard" className={styles.navLink}>
              ダッシュボード
            </a>
            <a href="/stores" className={styles.navLink}>
              店舗管理
            </a>
            <a href="/users" className={styles.navLink}>
              ユーザー管理
            </a>
            <a href="/settings" className={styles.navLink}>
              設定
            </a>
          </nav>
          
          <div className={styles.userSection}>
            <span className={styles.userEmail}>{user?.email}</span>
            <Button variant="ghost" size="sm" onClick={logout}>
              ログアウト
            </Button>
          </div>
        </div>
      </header>
      
      <main className={styles.main}>
        <div className={styles.mainContent}>
          {children}
        </div>
      </main>
    </div>
  );
};