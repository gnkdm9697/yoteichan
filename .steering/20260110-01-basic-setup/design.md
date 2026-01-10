# Phase 1: 基本機能 - 設計

## 技術スタック
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Supabase

## ディレクトリ構成

```
src/
├── app/
│   ├── layout.tsx          # 共通レイアウト
│   ├── page.tsx            # トップページ
│   ├── new/
│   │   └── page.tsx        # イベント作成
│   └── e/
│       └── [id]/
│           └── page.tsx    # イベント詳細（骨組み）
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Textarea.tsx
│   │   └── Modal.tsx
│   └── calendar/
│       ├── Calendar.tsx
│       ├── CalendarDay.tsx
│       └── TimeSlotPicker.tsx
├── lib/
│   ├── supabase.ts         # Supabaseクライアント
│   └── utils.ts            # ユーティリティ
└── types/
    └── index.ts            # 型定義
```

## データベース

### events テーブル
```sql
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id VARCHAR(10) NOT NULL UNIQUE,
  passphrase VARCHAR(50) NOT NULL,
  title VARCHAR(100) NOT NULL,
  location VARCHAR(200),
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### date_options テーブル
```sql
CREATE TABLE date_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(event_id, date, start_time)
);
```

## API エンドポイント

### POST /api/events
イベント作成

### GET /api/events/[publicId]
イベント取得（詳細表示用）

## コンポーネント設計

### Calendar
- 月表示のカレンダー
- 日付をタップで選択/解除
- 前月/次月ナビゲーション

### TimeSlotPicker
- 選択した日付ごとに表示
- 「終日」または「時間指定」を選択
- 時間指定時は開始/終了時間を入力

### Modal
- 作成完了時に表示
- URL表示とコピー機能
