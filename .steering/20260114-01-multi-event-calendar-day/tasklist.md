# タスクリスト: 同一日付の複数候補日対応

## 実装タスク

### 1. new/page.tsx の修正
- [x] `handleDateSelect` をトグルから追加のみに変更
- [ ] `handleRemoveDate` をインデックスベースに変更（`handleRemoveDateByIndex`）

### 2. TimeSlotPicker.tsx の修正
- [ ] Props の `onRemoveDate` を `onRemoveDateByIndex: (index: number) => void` に変更
- [ ] `expandedDate` を `expandedIndex` に変更
- [ ] `key` を `option.date` から `index` に変更
- [ ] 各ハンドラー（`handleAllDayToggle`, `handleTimeChange`, `handleTitleChange`）をインデックスベースに変更
- [ ] 新規追加時の自動展開ロジックをインデックスベースに変更

### 3. DateOptionEditor.tsx の修正
- [ ] `handleDateSelect` をトグルから追加のみに変更
- [ ] `handleRemoveDate` をインデックスベースに変更
- [ ] `key` を `option.date` から `index` に変更
- [ ] 各ハンドラーをインデックスベースに変更
- [ ] ヘルプテキストを「日付をクリックして追加」に変更

### 4. 品質確認
- [ ] `npm run build` が通ること
- [ ] `npm run lint` が通ること
- [ ] 手動テスト: 同じ日付を複数追加できること
- [ ] 手動テスト: 個別に削除できること
- [ ] 手動テスト: 編集画面でも同様に動作すること

## 完了条件

- 全タスクにチェックが入っていること
- ビルド・lintエラーがないこと
