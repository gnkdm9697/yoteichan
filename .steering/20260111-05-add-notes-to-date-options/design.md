# 候補日への備考フィールド追加 - 設計書

## 変更対象

### 1. データベース

#### マイグレーション（003_add_notes_to_date_options.sql）

```sql
ALTER TABLE date_options ADD COLUMN notes TEXT DEFAULT NULL;
```

### 2. 型定義

#### src/types/database.ts

`date_options` に `notes: string | null` を追加

### 3. フロントエンド

#### 変更するコンポーネント

| ファイル | 変更内容 |
|----------|----------|
| `TimeSlotPicker.tsx` | DateOption型にnotes追加、入力欄を追加 |
| `DateOptionEditor.tsx` | 編集モードでnotes入力欄を追加 |
| `ResponseForm.tsx` | 備考表示を追加 |

#### DateOption型の変更

```typescript
interface DateOption {
  date: string;
  startTime: string | null;
  endTime: string | null;
  title?: string | null;
  notes?: string | null;  // 追加
}
```

### 4. API

#### POST /api/events（イベント作成）

リクエストにnotesを含める:

```json
{
  "dateOptions": [
    { "date": "2025-01-15", "startTime": "19:00", "notes": "会場予約済み" }
  ]
}
```

#### GET /api/events/[publicId]（イベント取得）

レスポンスにnotesを含める:

```json
{
  "dateOptions": [
    { "id": "uuid", "date": "2025-01-15", "startTime": "19:00", "notes": "会場予約済み" }
  ]
}
```

#### PUT /api/events/[publicId]（イベント更新）

notesの更新をサポート

## UI設計

### 1. イベント作成画面（TimeSlotPicker）

```
┌─────────────────────────────┐
│ 📅 1月15日(水)          [×] │
│ ┌─────────────────────────┐ │
│ │ タイトル（任意）        │ │
│ │ Day1                    │ │
│ └─────────────────────────┘ │
│ ☐ 終日                      │
│ 開始: [19:00]               │
│ ┌─────────────────────────┐ │
│ │ 備考（任意）            │ │
│ │ 会場予約済み            │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

### 2. 回答画面（ResponseForm）

```
┌─────────────────────────────┐
│ 1月15日(水) 19:00〜         │
│ 📝 会場予約済み              │
│ [○] [△] [×]                 │
└─────────────────────────────┘
```

## 影響分析

### 永続ドキュメント更新

- `docs/functional-design.md` - date_optionsテーブル定義にnotesを追加
- `docs/glossary.md` - 必要に応じて用語追加

### 既存機能への影響

- 既存イベントは`notes=NULL`で動作（後方互換性あり）
- 回答機能には影響なし
