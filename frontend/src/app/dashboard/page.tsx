'use client';

import { Card, CardBody } from '@/components/Elements/Card';
import { DashboardLayout } from '@/components/Layout/DashboardLayout';
import styles from './page.module.scss';

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>ダッシュボード</h1>
          <p className={styles.subtitle}>システム管理画面へようこそ</p>
        </div>

        <div className={styles.statsGrid}>
          <Card>
            <CardBody>
              <div className={styles.statCard}>
                <h3 className={styles.statTitle}>総店舗数</h3>
                <p className={styles.statValue}>0</p>
                <p className={styles.statDescription}>登録済み店舗</p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className={styles.statCard}>
                <h3 className={styles.statTitle}>総ユーザー数</h3>
                <p className={styles.statValue}>1</p>
                <p className={styles.statDescription}>管理者アカウント</p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className={styles.statCard}>
                <h3 className={styles.statTitle}>今月の予約数</h3>
                <p className={styles.statValue}>0</p>
                <p className={styles.statDescription}>全店舗合計</p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className={styles.statCard}>
                <h3 className={styles.statTitle}>アクティブ率</h3>
                <p className={styles.statValue}>100%</p>
                <p className={styles.statDescription}>稼働中の店舗</p>
              </div>
            </CardBody>
          </Card>
        </div>

        <div className={styles.contentGrid}>
          <Card>
            <CardBody>
              <h2 className={styles.sectionTitle}>最近の活動</h2>
              <p className={styles.emptyState}>まだアクティビティはありません</p>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <h2 className={styles.sectionTitle}>クイックアクション</h2>
              <div className={styles.quickActions}>
                <a href="/stores/new" className={styles.actionLink}>
                  新規店舗登録
                </a>
                <a href="/users" className={styles.actionLink}>
                  ユーザー管理
                </a>
                <a href="/settings" className={styles.actionLink}>
                  システム設定
                </a>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}