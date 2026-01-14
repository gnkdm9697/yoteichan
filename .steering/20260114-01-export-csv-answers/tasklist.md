# 回答データCSVエクスポート機能 - タスクリスト

## タスク一覧

### Phase 1: CSV生成ユーティリティ作成

- [ ] `src/lib/csv.ts` 新規作成
  - [ ] `escapeCSVField()` - CSVフィールドエスケープ関数
  - [ ] `generateResponsesCsv()` - CSV文字列生成関数
  - [ ] `downloadCsv()` - ダウンロード実行関数
  - [ ] `sanitizeFilename()` - ファイル名サニタイズ関数

### Phase 2: UIコンポーネント更新

- [ ] `ResponseTable.tsx` にダウンロードボタン追加
  - [ ] `eventTitle` props追加
  - [ ] ダウンロードボタンUI実装
  - [ ] クリックハンドラ実装

### Phase 3: 結合・動作確認

- [ ] `EventEditSection.tsx` から `eventTitle` を渡す
- [ ] ビルド確認 (`npm run build`)
- [ ] 動作確認
  - [ ] CSVダウンロードできること
  - [ ] Excelで文字化けしないこと
  - [ ] 全参加者の回答が正しく出力されること
  - [ ] メモが括弧付きで表示されること
  - [ ] 集計が正しいこと

### Phase 4: コミット・プッシュ

- [ ] コミット作成
- [ ] ブランチにプッシュ

## 完了基準

- CSVダウンロードボタンがイベント詳細画面に表示される
- ボタンクリックでCSVがダウンロードされる
- Excelで開いて文字化けしない
- フォーマットが要件通り
