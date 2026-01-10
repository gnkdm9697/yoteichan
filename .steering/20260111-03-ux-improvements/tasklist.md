# UX改善 - タスクリスト

## Phase 1: クイック修正

### 1.1 カレンダーデフォルト表示
- [ ] `DateOptionEditor.tsx:40` - `useState(false)` → `useState(true)`

### 1.2 時間表示確認
- [ ] `date.ts` / 各コンポーネントで秒が表示されていないか確認
- [ ] 必要に応じてフォーマット修正

### 1.3 回答フォーム横並びレイアウト
- [ ] `ResponseForm.tsx` - 日付ラベルとStatusButtonを`flex-row`に変更
- [ ] レスポンシブ対応（モバイルは縦、デスクトップは横）

---

## Phase 2: 表の転置

### 2.1 ResponseTable.tsx 変更
- [ ] ヘッダー行: 「日付」→ 参加者名の列に変更
- [ ] ボディ行: 各行を日付単位に変更
- [ ] 集計を各行末のセルに移動

### 2.2 ResponseRow.tsx 変更/置換
- [ ] 日付行コンポーネントとして再構築
- [ ] または新規DateRow.tsxを作成

### 2.3 SummaryRow.tsx 変更
- [ ] 独立した行から、各行内のセルに変更
- [ ] または不要になれば削除

---

## Phase 3: 回答編集機能

### 3.1 EventResponseSection.tsx - 状態管理
- [ ] `editingResponse` state追加
- [ ] 編集中の参加者情報を保持

### 3.2 ResponseForm.tsx - 初期値対応
- [ ] `initialName` prop追加
- [ ] `initialAnswers` prop追加
- [ ] useStateの初期値に反映

### 3.3 ResponseTable.tsx - クリックハンドラ
- [ ] 参加者名にクリックイベント追加
- [ ] `onNameClick` callback prop追加

### 3.4 編集フロー統合
- [ ] 名前クリック → フォームに既存データを表示
- [ ] 送信成功 → テーブル更新

---

## Phase 4: 日付オプション改善

### 4.1 DB変更
- [ ] Supabase: `date_options`テーブルに`title`カラム追加（nullable）

### 4.2 型定義更新
- [ ] `src/types/database.ts` - title追加
- [ ] `src/types/index.ts` - DateOption, CreateDateOptionInput更新

### 4.3 TimeSlotPicker.tsx - タイトル入力
- [ ] タイトル入力欄追加
- [ ] onTitleChange ハンドラ追加

### 4.4 TimeSlotPicker.tsx - リスト表示
- [ ] 個別カード → 1枚カード内リスト形式に変更
- [ ] 背景色交互表示

### 4.5 API更新
- [ ] `src/app/api/events/route.ts` - title対応
- [ ] `src/app/api/events/[publicId]/route.ts` - title対応

### 4.6 表示対応
- [ ] ResponseTable/ResponseFormでタイトル表示

---

## 検証

- [ ] イベント作成 → 日付選択 → タイトル入力 → 保存
- [ ] 回答画面で表が転置されていることを確認
- [ ] 参加者名クリック → 編集できることを確認
- [ ] 編集モードでカレンダーがデフォルト表示されることを確認
- [ ] モバイル表示確認
- [ ] ビルド成功確認
