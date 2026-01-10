# 予定ちゃん - 技術仕様書

## 技術スタック

### フロントエンド
- **フレームワーク**: Next.js 14 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **状態管理**: React hooks (useState, useEffect)

### バックエンド
- **BaaS**: Supabase
  - PostgreSQL データベース
  - 自動生成REST API
  - Row Level Security (RLS)

### インフラ
- **ホスティング**: Vercel
- **データベース**: Supabase (PostgreSQL)

## システム構成図

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Browser   │────▶│   Vercel    │────▶│  Supabase   │
│  (Next.js)  │◀────│  (Next.js)  │◀────│ (PostgreSQL)│
└─────────────┘     └─────────────┘     └─────────────┘
```

## 開発環境

### 必要なツール
- Node.js 18+
- npm / yarn / pnpm
- Git

### 環境変数

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## デプロイ

### Vercel
- GitHub リポジトリ連携
- main ブランチへの push で自動デプロイ
- 環境変数は Vercel ダッシュボードで設定

### Supabase
- Supabase ダッシュボードでプロジェクト作成
- SQL エディタでテーブル作成
- RLS ポリシー設定

## パフォーマンス要件

| 項目 | 目標値 |
|------|--------|
| 初回表示 | 2秒以内 |
| API レスポンス | 500ms以内 |
| Lighthouse スコア | 90+ |

## セキュリティ

- XSS 対策: React のエスケープ機能
- SQL インジェクション対策: Supabase クライアントのパラメータ化クエリ
- CORS: Vercel のデフォルト設定
