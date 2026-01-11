# 回答時の備考フィールド追加 - 設計書

## 変更対象

### 1. データベース

#### マイグレーション（003_add_notes_to_responses.sql）

```sql
ALTER TABLE responses ADD COLUMN notes TEXT DEFAULT NULL;
```

### 2. 型定義

#### src/types/database.ts

`responses` に `notes: string | null` を追加

### 3. フロントエンド

#### 変更するコンポーネント

| ファイル | 変更内容 |
|----------|----------|
| `ResponseForm.tsx` | 各候補日に備考入力欄を追加 |
| `ResponseTable.tsx` | 回答一覧で備考を表示 |

### 4. API

#### POST /api/responses（回答作成）

リクエストにnotesを含める:

```json
{
  "eventId": "uuid",
  "name": "田中",
  "answers": {
    "dateOptionId1": { "status": "ok", "notes": "遅れます" },
    "dateOptionId2": { "status": "maybe", "notes": "" }
  }
}
```

#### GET /api/events/[publicId]（イベント取得）

レスポンスのresponsesにnotesを含める:

```json
{
  "responses": [
    {
      "name": "田中",
      "answers": {
        "dateOptionId1": { "status": "ok", "notes": "遅れます" }
      }
    }
  ]
}
```

## UI設計

### 1. 回答入力画面（ResponseForm）

```
┌─────────────────────────────┐
│ 1月15日(水) 19:00〜         │
│ [○] [△] [×]                 │
│ ┌─────────────────────────┐ │
│ │ 備考（例：遅れます）    │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

### 2. 回答一覧（ResponseTable）

```
┌────────┬─────────┬─────────┐
│        │ 1/15    │ 1/16    │
├────────┼─────────┼─────────┤
│ 田中   │ ○       │ △       │
│        │ 遅れます │ 午後から │
├────────┼─────────┼─────────┤
│ 佐藤   │ ○       │ ×       │
└────────┴─────────┴─────────┘
```

## 影響分析

### 永続ドキュメント更新

- `docs/functional-design.md` - responsesテーブル定義にnotesを追加

### 既存機能への影響

- 既存回答は`notes=NULL`で動作（後方互換性あり）
- イベント作成・編集機能には影響なし
