# UX改善 - 設計

## 1. 回答画面の表転置

### 変更前の構造
```
| 名前 | 1/8  | 1/9  | 1/10 |
|------|------|------|------|
| 田中 | ○    | △    | ×    |
| 山田 | ○    | ○    | △    |
| 集計 | 2/0/0| 1/1/0| 0/1/1|
```

### 変更後の構造
```
| 日付 | 田中 | 山田 | 集計    |
|------|------|------|---------|
| 1/8  | ○    | ○    | 2/0/0   |
| 1/9  | △    | ○    | 1/1/0   |
| 1/10 | ×    | △    | 0/1/1   |
```

### 修正ファイル
- `src/components/features/ResponseTable.tsx` - テーブル構造の変更
- `src/components/features/ResponseRow.tsx` - 不要になる可能性（DateRowに置換）
- `src/components/features/SummaryRow.tsx` - 集計を列から行末セルに変更

## 2. 回答編集機能

### 状態管理
```typescript
// EventResponseSection.tsx
interface EditingResponse {
  name: string;
  answers: Record<string, ResponseStatus>;
}

const [editingResponse, setEditingResponse] = useState<EditingResponse | null>(null);
```

### フロー
1. 参加者名クリック → `onNameClick(name, answers)` 発火
2. `editingResponse` にセット
3. `ResponseForm` に `initialName` と `initialAnswers` を渡す
4. 送信成功 → `editingResponse` をクリア、テーブル更新

### 修正ファイル
- `src/app/e/[publicId]/EventResponseSection.tsx` - 編集状態管理
- `src/components/features/ResponseForm.tsx` - 初期値対応
- `src/components/features/ResponseTable.tsx` - クリックハンドラ追加

## 3. 候補日タイトル機能

### データベース変更
```sql
ALTER TABLE date_options ADD COLUMN title TEXT;
```

### 型定義変更
```typescript
// src/types/index.ts
interface DateOption {
  date: string;
  startTime: string | null;
  endTime: string | null;
  title?: string | null;  // 追加
}
```

### 修正ファイル
- `src/types/database.ts` - DB型定義
- `src/types/index.ts` - アプリ型定義
- `src/components/features/TimeSlotPicker.tsx` - タイトル入力UI
- `src/app/api/events/route.ts` - 作成API
- `src/app/api/events/[publicId]/route.ts` - 更新API

## 4. 日付カードのリスト表示

### 変更前
```
┌─────────────────┐
│ 1/8(水) [×]     │
│ □終日           │
│ 19:00 〜 21:00  │
└─────────────────┘
┌─────────────────┐
│ 1/9(木) [×]     │
│ □終日           │
│ 19:00 〜 21:00  │
└─────────────────┘
```

### 変更後
```
┌─────────────────────────────────┐
│ 選択した候補日 (2件)            │
├─────────────────────────────────┤
│ 1/8(水) 19:00-21:00 [タイトル] [×] │ ← 背景色A
├─────────────────────────────────┤
│ 1/9(木) 19:00-21:00 [タイトル] [×] │ ← 背景色B
└─────────────────────────────────┘
```

### 修正ファイル
- `src/components/features/TimeSlotPicker.tsx` - レイアウト変更

## 5. 回答フォームの横並びレイアウト

### 変更前
```
1/8(水) 09:00〜12:00
[○] [△] [×]
```

### 変更後
```
1/8(水) 09:00〜12:00  [○] [△] [×]
```

### 実装
```tsx
// ResponseForm.tsx
<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
  <div className="date-time-label">...</div>
  <StatusButton ... />
</div>
```

## 6. カレンダーデフォルト表示

### 変更箇所
```typescript
// DateOptionEditor.tsx:40
// Before
const [showCalendar, setShowCalendar] = useState(false);

// After
const [showCalendar, setShowCalendar] = useState(true);
```
