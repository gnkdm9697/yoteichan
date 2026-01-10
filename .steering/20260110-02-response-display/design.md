# Phase 2: 回答・表示機能 - 設計

## 追加ディレクトリ構成

```
src/
├── components/
│   └── response/
│       ├── ResponseForm.tsx      # 回答フォーム
│       ├── ResponseTable.tsx     # 回答一覧テーブル
│       ├── ResponseRow.tsx       # 回答行
│       ├── StatusButton.tsx      # ○△× ボタン
│       └── SummaryRow.tsx        # 集計行
└── app/
    └── e/
        └── [id]/
            └── page.tsx          # 回答機能を追加
```

## データベース

### responses テーブル（新規）
```sql
CREATE TABLE responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  date_option_id UUID NOT NULL REFERENCES date_options(id) ON DELETE CASCADE,
  name VARCHAR(50) NOT NULL,
  status VARCHAR(10) NOT NULL CHECK (status IN ('ok', 'maybe', 'ng')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(event_id, name, date_option_id)
);
```

## API エンドポイント

### POST /api/events/[publicId]/responses
回答を登録・更新

**Request:**
```json
{
  "name": "田中",
  "answers": {
    "uuid-1": "ok",
    "uuid-2": "maybe"
  }
}
```

### GET /api/events/[publicId] の拡張
レスポンスに回答データと集計を追加

```json
{
  "id": "abc123",
  "title": "飲み会",
  ...
  "responses": [
    {
      "name": "田中",
      "answers": { "uuid-1": "ok", "uuid-2": "maybe" }
    }
  ],
  "summary": {
    "uuid-1": { "ok": 2, "maybe": 0, "ng": 1 },
    "uuid-2": { "ok": 1, "maybe": 1, "ng": 1 }
  }
}
```

## コンポーネント設計

### StatusButton
- 3つの状態: ok / maybe / ng / 未選択
- タップで状態を切り替え
- 選択中は色付き、未選択はグレー

```tsx
interface StatusButtonProps {
  status: 'ok' | 'maybe' | 'ng' | null;
  onChange: (status: 'ok' | 'maybe' | 'ng') => void;
}
```

### ResponseForm
- 名前入力
- 候補日ごとに StatusButton を3つ表示
- 送信ボタン

### ResponseTable
- ヘッダー: 空白 + 候補日リスト
- ボディ: 参加者名 + 各候補日の回答
- フッター: 集計行

## 画面レイアウト

```
┌─────────────────────────┐
│ イベント情報            │
├─────────────────────────┤
│ 回答フォーム            │
│ ・名前入力              │
│ ・候補日ごとに○△×選択  │
│ ・回答ボタン            │
├─────────────────────────┤
│ みんなの回答            │
│ ・回答一覧テーブル      │
│ ・集計表示              │
└─────────────────────────┘
```
