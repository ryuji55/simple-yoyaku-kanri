# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
Simple Yoyaku Kanri is a full-stack reservation management system for small-scale massage shops and salons. It aims to provide a simple, affordable (under ¥1,000/month), and easy-to-use web reservation system.

### Target Users
- Small massage shops, beauty salons, and aesthetic salons that want to "graduate" from HotPepper
- Stores currently managing reservations via LINE/phone who want to eliminate manual coordination
- Store owners/staff who are not IT-savvy and need minimal, essential features only

## Commands

### Frontend Development (`cd frontend`)
```bash
npm run dev      # Start Next.js development server (port 3000)
npm run build    # Build production bundle
npm run start    # Start production server
npm run lint     # Run Next.js linter
```

### Backend Development (`cd backend`)
```bash
npm run build    # Compile TypeScript to JavaScript
npm run start    # Start production server from dist/
npx prisma migrate dev   # Run database migrations
npx prisma generate      # Generate Prisma client
npx prisma studio        # Open Prisma Studio (database GUI)
```

### Database Setup
```bash
# Set DATABASE_URL in backend/.env file
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"

# Run migrations
cd backend && npx prisma migrate dev
```

## Architecture

### Frontend Structure
- **Framework**: Next.js 15 with App Router (`/frontend/src/app/`)
- **Architecture Pattern**: [Bulletproof React](https://github.com/alan2207/bulletproof-react)
- **Styling**: CSS Modules with SCSS (`.module.scss` files)
- **Fonts**: Geist Sans and Geist Mono via `next/font/google`
- **TypeScript**: Strict mode enabled

#### Frontend Directory Structure (Bulletproof React)
```
frontend/src/
├── app/                    # Next.js App Router pages
├── components/             # Shared components
│   ├── Elements/          # Basic UI elements (Button, Input, etc.)
│   ├── Form/              # Form components
│   ├── Layout/            # Layout components
│   └── ui/                # shadcn/ui components (if used)
├── features/              # Feature-based modules
│   ├── auth/              # Authentication feature
│   ├── bookings/          # Booking management
│   ├── customers/         # Customer management
│   └── stores/            # Store management
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions and libraries
├── providers/             # React context providers
├── stores/                # State management (Zustand/Jotai)
├── types/                 # TypeScript type definitions
└── utils/                 # Helper functions
```

### Backend Structure (Domain-Driven Design)
- **Entry**: `/backend/app.ts` - Express server with CORS enabled
- **Architecture**: Loose DDD with layered architecture
- **Database**: PostgreSQL via Prisma ORM
- **Schema**: `/backend/prisma/schema.prisma` - comprehensive reservation system models
- **Generated Client**: `/backend/generated/prisma/`

#### Backend Directory Structure
```
backend/src/
├── routes/                # API endpoints
│   ├── auth/             # Authentication routes
│   ├── stores/           # Store management routes
│   ├── bookings/         # Booking routes
│   └── admin/            # Admin routes
├── useCases/             # Business logic layer
│   ├── auth/             # Authentication use cases
│   ├── booking/          # Booking use cases
│   └── store/            # Store use cases
├── services/             # Shared business logic
│   ├── emailService.ts   # Email notification service
│   ├── authService.ts    # Authentication service
│   └── validationService.ts
├── repositories/         # Data access layer
│   ├── storeRepository.ts
│   ├── bookingRepository.ts
│   └── customerRepository.ts
├── middleware/           # Express middleware
├── utils/                # Helper functions
└── types/                # TypeScript types
```

### Database Schema Overview
Core entities for reservation management:
- **Admin**: System administrator account for multi-store management
- **Store**: Multi-tenant businesses with booking settings
  - `cancel_deadline_hour`: Hours before appointment when web cancellation is allowed
  - `online_booking_deadline_minute`: Minutes before appointment when new bookings are accepted
  - `max_reservation_month_ahead`: Maximum months ahead for accepting reservations
- **Staff**: Employees with roles (owner/staff) and schedules
- **Customer**: Users who make bookings
- **Menu**: Services offered (with duration and pricing)
- **Booking**: Reservations linking customers, staff, and menus
  - Status: 'reserved', 'canceled', 'no_show', 'completed'
- **BookingMenu**: Junction table for multi-service bookings
- **StaffSchedule**: Staff availability management
- **NotificationLog**: Communication tracking

Key features modeled:
- Configurable booking rules per store (cancellation deadline, online booking window)
- Staff scheduling and role management  
- Multi-service bookings via BookingMenu junction
- Booking status tracking and notification system
- System admin access for cross-store management

## Development Notes

### Current State
- Database schema is complete and migrated
- Backend has minimal Express setup ready for API development
- Frontend is using Next.js default template (needs implementation)
- Biome and Lefthook are being added for code quality

### Working with Prisma
When modifying the database:
1. Edit `/backend/prisma/schema.prisma`
2. Run `npx prisma migrate dev --name describe_your_change`
3. Prisma client regenerates automatically

### TypeScript Configuration
- Frontend and backend have separate `tsconfig.json` files
- Backend uses `ts-node` for development (no build step needed for dev)
- Frontend uses Next.js built-in TypeScript support

## Feature Requirements (MVP)

### Customer Features
- Web calendar UI for booking appointments
- Registration with name, email, phone, password
- Email notifications (booking confirmation, reminders, changes/cancellations)
- My page (booking history, changes, cancellations)
- Recurring bookings (with interval selection)

### Store Management Features
- Booking calendar management (overall, by staff, by menu)
- Customer database with history and repeat count
- Create/edit/cancel bookings
- Staff and menu management
- Email notification history
- Store settings (cancellation deadline, booking window, etc.)

### System Admin Features
- Cross-store management dashboard
- Full access to all stores, bookings, and customer data
- Password reset and support operations
- Usage monitoring and statistics

### Excluded from MVP
- Online payments, coupons, membership ranks
- Phone/SMS notifications
- Social media authentication
- LINE/Google Calendar integration (future expansion)

## API Design Guidelines

### Authentication & User Management
- `POST /auth/login` - Unified login for all user types
- `POST /auth/register` - User registration
- `POST /auth/forgot-password` - Password reset request
- `POST /auth/reset-password` - Password reset confirmation

### Store Management
- `GET /stores/:id` - Get store details
- `PATCH /stores/:id` - Update store info and settings
- `GET /stores/:id/settings` - Get store booking rules
- `PATCH /stores/:id/settings` - Update booking rules

### Booking Management
- `GET /stores/:storeId/bookings` - List store bookings
- `POST /stores/:storeId/bookings` - Create new booking
- `GET /bookings/:id` - Get booking details
- `PATCH /bookings/:id` - Update booking
- `DELETE /bookings/:id` - Cancel booking
- `GET /stores/:id/available-dates` - Get available booking dates
- `GET /stores/:id/available-times` - Get available time slots

### Staff Management
- `GET /stores/:storeId/staff` - List staff members
- `POST /stores/:storeId/staff` - Add new staff
- `PATCH /staff/:id` - Update staff info
- `DELETE /staff/:id` - Deactivate staff

### Admin Endpoints
- `GET /admin/stores` - List all stores
- `GET /admin/users` - List all users
- `GET /admin/bookings` - Cross-store booking search
- Admin can bypass all validation rules for emergency operations

## UI/UX Design Principles

### Customer-facing Pages
- Mobile-first responsive design
- Simple calendar interface for booking
- Clear display of availability and restrictions
- Intuitive booking flow with minimal steps

### Store Management Pages
- Dashboard with today's bookings overview
- Calendar and list view toggle
- Quick actions for common tasks
- Role-based access control

### System Admin Pages
- Multi-store overview dashboard
- Powerful search and filtering
- Emergency override capabilities
- Audit trail for all actions

## Development Workflow

### Code Quality
- Use Biome for linting and formatting
- Lefthook for pre-commit checks
- Write tests for critical business logic
- Follow TypeScript strict mode

### Git Workflow (IMPORTANT)
**すべての開発作業は必ずfeatureブランチで行うこと**

1. **ブランチ戦略**
   - `main`: 本番環境用のコード（直接コミット禁止）
   - `develop`: 開発統合ブランチ（直接コミット禁止）
   - `feature/*`: 機能開発ブランチ（ここで作業する）

2. **開発フロー**
   ```bash
   # 1. developから最新を取得
   git checkout develop
   git pull origin develop
   
   # 2. featureブランチを作成
   git checkout -b feature/機能名
   
   # 3. 開発・コミット
   git add .
   git commit -m "feat: 実装内容"
   
   # 4. featureブランチをプッシュ
   git push origin feature/機能名
   
   # 5. GitHub上でPull Requestを作成
   # feature/機能名 → develop
   ```

3. **コミットメッセージ規約**
   - `feat:` 新機能
   - `fix:` バグ修正
   - `docs:` ドキュメントのみの変更
   - `style:` コードの意味に影響しない変更
   - `refactor:` バグ修正でも機能追加でもないコード変更
   - `test:` テストの追加・修正
   - `chore:` ビルドプロセスや補助ツールの変更

4. **重要なルール**
   - developブランチへの直接コミットは禁止
   - 必ずfeatureブランチを作成して作業
   - Pull Request経由でのみdevelopにマージ
   - コードレビューを経てからマージ

### Deployment
- Frontend: Vercel (automatic deployment from GitHub)
- Backend: Render.com or Railway.app
- Database: PostgreSQL on Render/Railway/Supabase
- Start with free tiers, scale as needed

## レビュー運用（毎回実行：必須）

> この節は運用ルールです。**各タスク/PR/差分出力のたびに必ず実施**し、所定の「出力テンプレート」を**毎回同梱**してください。  
> 本節の改変は**要合意**。無断変更・削除を禁止します。

### 1. ClaudeCode セルフレビュー（自動チェック）
- [ ] ビルド/型チェック：`pnpm -w -r typecheck` が PASS
- [ ] Lint：`pnpm -w -r lint` が PASS（警告は理由を明記）
- [ ] 単体/統合テスト：変更範囲に関連するテストが PASS（件数を記録）
- [ ] E2E（UI/APIに影響がある変更時）：該当ケースが PASS（対象ケース名を記録）
- [ ] API コントラクト整合：追加/変更/削除エンドポイントを列挙し、互換性を説明
- [ ] 同時実行/競合（該当時）：重複予約等のレース対策の有無を明示
- [ ] タイムゾーン整合：保存UTC/表示JSTの前提からの逸脱がないこと
- [ ] 環境変数ポリシー：`DATABASE_URL` ハードコード禁止・`.env` 非上書き遵守
- [ ] セキュリティ/個人情報：電話番号等の取り扱い・ログ出力の最小化を確認

### 2. 人間レビューで見てほしい内容（提出フォーマット）
- 変更の背景/目的（1〜3行）
- 変更範囲と影響（**壊れうる箇所/依存**を具体的に）
- **重要箇所（ファイル/関数/行）**：レビュー優先ポイントを列挙
- 懸念点・代替案（あれば）
- テスト観点（正常/異常/境界・時刻/競合）
- ロールバック手順（最小手順で戻せる説明）

### 3. ブラウザ動作確認手順（提出フォーマット）
前提：Frontend `http://localhost:3000`、Backend `http://localhost:4000`
1) `GET /health` が 200 か確認（DB:true/false を併記）  
2) Public：`/` で可用枠表示 → メニュー選択 → 名前/電話入力 → 予約確定  
   - 期待結果：予約成功トースト/完了画面。コンソールエラーなし  
3) 異常系：
   - BL登録番号で予約 → **403 表示**  
   - 受付締切/先予約上限超過 → **400 表示**  
   - 同一時刻に重複予約 → **409 表示**  
4) Owner：`/owner` から当日一覧表示、`no_show` トグル、`/owner/blocks`/`/owner/menus`/`/owner/blacklist` CRUD 確認  
5) 表示時刻がJSTで意図通りか確認（境界：日跨ぎ/分単位）

> それぞれ **操作手順・期待結果・確認スクリーンショット目安** を記載。

### 4. 実装の意図（提出フォーマット）
- 設計選択の理由（採用案/却下案）
- トレードオフ（性能/保守/簡潔さ）
- 将来拡張の余地（どこを差し替え/増設可能にしたか）

### 5. 出力テンプレート（毎回、差分の末尾に同梱）
```md
## セルフレビュー結果
- ビルド/型: PASS（timestamp）
- Lint: PASS（警告0 | 警告N: <理由>）
- 単体/統合テスト: PASS（X passed）
- E2E: （対象なら）PASS（cases: ...）
- API整合: 追加/変更/削除 = [...]; 非互換: 有/無（説明）
- 競合対策: 有/不要（理由）
- TZ整合: 問題なし / 注意点:
- 環境変数: ポリシー遵守（.env非上書き / 接続文字列未ハードコード）

## 人間レビューで見てほしい点
- 背景/目的:
- 影響範囲:
- 重要箇所:
- 懸念点/代替案:
- テスト観点:
- ロールバック:

## ブラウザ動作確認
- 前提:
- 手順と期待結果:
- 異常系結果:
- スクリーンショット目安:

## 実装の意図
- 設計選択:
- トレードオフ:
- 将来拡張:
```