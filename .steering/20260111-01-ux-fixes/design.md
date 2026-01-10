# UX修正 - 設計

## 1. 合言葉入力の改善

### 対象ファイル
- `src/components/features/PassphraseModal.tsx`

### 変更内容
- `type="password"` を `type="text"` に変更
- IME composition対応（日本語入力時のcompositionイベント処理）

## 2. 予定のデフォルト時間変更

### 対象ファイル
- `src/app/new/page.tsx`

### 変更内容
- `handleDateSelect`関数内のデフォルト値を変更
- L46: `{ date: dateStr, startTime: null, endTime: null }` → `{ date: dateStr, startTime: '19:00', endTime: '21:00' }`

## 3. 回答フォームの折りたたみ機能

### 対象ファイル
- `src/app/e/[publicId]/EventResponseSection.tsx`

### 変更内容
- 回答送信後の状態管理追加
- トグル用のUI追加（クリックで開閉）
- 折りたたみ時は「回答を編集する」などのボタン表示
- 展開時は現在のResponseForm表示

### 状態管理
```typescript
const [isCollapsed, setIsCollapsed] = useState(false);
```

- 回答送信成功時: `setIsCollapsed(true)`
- トグルクリック時: `setIsCollapsed(!isCollapsed)`
