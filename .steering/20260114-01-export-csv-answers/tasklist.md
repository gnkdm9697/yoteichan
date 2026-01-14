# 回答データCSVエクスポート機能 - タスクリスト

## タスク一覧

### Phase 1: CSV生成ユーティリティ作成

- [x] `src/lib/csv.ts` 新規作成
  - [x] `escapeCSVField()` - CSVフィールドエスケープ関数
  - [x] `generateResponsesCsv()` - CSV文字列生成関数
  - [x] `downloadCsv()` - ダウンロード実行関数
  - [x] `sanitizeFilename()` - ファイル名サニタイズ関数

### Phase 2: UIコンポーネント更新

- [x] `ResponseTable.tsx` にダウンロードボタン追加
  - [x] `eventTitle` props追加
  - [x] ダウンロードボタンUI実装
  - [x] クリックハンドラ実装

### Phase 3: 結合・動作確認

- [x] `EventEditSection.tsx` から `eventTitle` を渡す
- [x] 型チェック確認 (`npx tsc --noEmit`)
- [ ] 動作確認（デプロイ後）
  - [ ] CSVダウンロードできること
  - [ ] Excelで文字化けしないこと
  - [ ] 全参加者の回答が正しく出力されること
  - [ ] メモが括弧付きで表示されること
  - [ ] 集計が正しいこと

### Phase 4: コミット・プッシュ

- [x] コミット作成
- [x] ブランチにプッシュ

## 完了基準

- CSVダウンロードボタンがイベント詳細画面に表示される
- ボタンクリックでCSVがダウンロードされる
- Excelで開いて文字化けしない
- フォーマットが要件通り
