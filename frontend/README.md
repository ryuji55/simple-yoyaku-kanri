# Frontend

予約管理システムのフロントエンド

## セットアップ

1. 環境変数の設定
```bash
cp .env.local.example .env.local
```

2. 依存関係のインストール
```bash
npm install
```

## 開発

```bash
npm run dev
```

http://localhost:3000 でアクセス可能

## ビルド

```bash
npm run build
npm run start
```

## 画面構成

### 認証
- `/login` - ログイン画面（顧客・店舗・管理者）
- `/register/customer` - 顧客登録
- `/register/store` - 店舗登録

### 顧客向け
- `/customer` - 顧客ダッシュボード
- `/customer/bookings` - 予約一覧
- `/customer/booking/new` - 新規予約

### 店舗向け
- `/store` - 店舗ダッシュボード
- `/store/bookings` - 予約管理
- `/store/staff` - スタッフ管理
- `/store/menus` - メニュー管理
- `/store/settings` - 店舗設定

### 管理者向け
- `/admin` - 管理者ダッシュボード
- `/admin/stores` - 店舗管理
- `/admin/users` - ユーザー管理

## 技術スタック

- Next.js 15 (App Router)
- TypeScript
- CSS Modules
- React Hook Form
- Axios
- JWT認証
