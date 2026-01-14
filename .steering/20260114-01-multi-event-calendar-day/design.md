# 設計: 同一日付の複数候補日対応

## 変更方針

同じ日付を複数持てるようにするため、候補日の識別を「日付文字列」から「配列インデックス」に変更する。

## 影響範囲

| ファイル | 変更内容 |
|---------|---------|
| `src/app/new/page.tsx` | `handleDateSelect`: トグル → 追加のみ、`handleRemoveDate`: 日付 → インデックス |
| `src/components/features/TimeSlotPicker.tsx` | インデックスベースの識別・削除に対応 |
| `src/components/features/DateOptionEditor.tsx` | 同様にインデックスベースに対応 |
| `src/components/features/Calendar.tsx` | 変更なし（日付がハイライトされる動作は維持） |

## データ構造

既存の `DateOption` インターフェースは変更しない。

```typescript
interface DateOption {
  date: string;           // YYYY-MM-DD（重複可）
  startTime: string | null;
  endTime: string | null;
  title?: string | null;
}
```

同じ日付が複数ある場合の例:
```typescript
[
  { date: '2026-01-15', startTime: '12:00', endTime: null, title: 'ランチ' },
  { date: '2026-01-15', startTime: '19:00', endTime: null, title: '飲み会' },
  { date: '2026-01-16', startTime: '19:00', endTime: null, title: null },
]
```

## コンポーネント設計

### 1. new/page.tsx

**変更前:**
```typescript
const handleDateSelect = (dateStr: string) => {
  const exists = prev.find((opt) => opt.date === dateStr);
  if (exists) {
    return prev.filter((opt) => opt.date !== dateStr); // 削除
  }
  return [...prev, newOption].sort(...); // 追加
};

const handleRemoveDate = (date: string) => {
  setDateOptions((prev) => prev.filter((opt) => opt.date !== date));
};
```

**変更後:**
```typescript
const handleDateSelect = (dateStr: string) => {
  // 常に追加のみ
  return [...prev, newOption].sort(...);
};

const handleRemoveDateByIndex = (index: number) => {
  setDateOptions((prev) => prev.filter((_, i) => i !== index));
};
```

### 2. TimeSlotPicker.tsx

**Props変更:**
```typescript
interface TimeSlotPickerProps {
  dateOptions: DateOption[];
  onUpdate: (dateOptions: DateOption[]) => void;
  onRemoveDateByIndex: (index: number) => void;  // 変更
}
```

**内部変更:**
- `key={option.date}` → `key={index}`
- `expandedDate: string | null` → `expandedIndex: number | null`
- 各ハンドラーを日付ベース → インデックスベースに変更

### 3. DateOptionEditor.tsx

TimeSlotPickerと同様の変更を適用。

## UI/UX

- カレンダーで日付をクリック → 新しい候補枠が追加される
- 同じ日付が複数ある場合、カレンダー上ではハイライト表示（変更なし）
- 削除は候補日リストの×ボタンから個別に行う
- ヘルプテキストを「日付をクリックして追加」に変更
