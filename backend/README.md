# Backend API

予約管理システムのバックエンドAPI

## セットアップ

1. 環境変数の設定
```bash
cp .env.example .env
```

2. 依存関係のインストール
```bash
npm install
```

3. データベースのマイグレーション
```bash
npx prisma migrate dev
```

4. 初期データの投入
```bash
npx prisma db seed
```

## 開発

```bash
npm run dev
```

## APIエンドポイント

### 認証

#### 管理者ログイン
```
POST /api/auth/login/admin
```

#### 店舗ログイン
```
POST /api/auth/login/store
```

#### 顧客ログイン
```
POST /api/auth/login/customer
```

#### 店舗登録
```
POST /api/auth/register/store
```

#### 顧客登録
```
POST /api/auth/register/customer
```

### 店舗

#### 店舗一覧取得（管理者のみ）
```
GET /api/stores
```

#### 店舗詳細取得
```
GET /api/stores/:id
```

#### 店舗情報更新
```
PATCH /api/stores/:id
```

#### 店舗設定取得
```
GET /api/stores/:id/settings
```

#### 店舗設定更新
```
PATCH /api/stores/:id/settings
```

## 認証

JWTトークンを使用。Authorizationヘッダーに`Bearer <token>`形式で設定。

## エラーレスポンス

```json
{
  "success": false,
  "error": {
    "message": "エラーメッセージ"
  }
}
```