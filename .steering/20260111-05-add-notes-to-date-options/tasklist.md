# 候補日への備考フィールド追加 - タスクリスト

## フェーズ1: データベース・型定義

- [ ] 1.1 マイグレーションファイル作成（003_add_notes_to_date_options.sql）
- [ ] 1.2 Supabaseでマイグレーション適用
- [ ] 1.3 src/types/database.ts に notes フィールド追加

## フェーズ2: API更新

- [ ] 2.1 POST /api/events - notes を保存するよう修正
- [ ] 2.2 GET /api/events/[publicId] - notes を返すよう修正
- [ ] 2.3 PUT /api/events/[publicId] - notes を更新するよう修正

## フェーズ3: フロントエンド（入力）

- [ ] 3.1 TimeSlotPicker.tsx - DateOption型にnotes追加
- [ ] 3.2 TimeSlotPicker.tsx - 備考入力欄のUI追加
- [ ] 3.3 DateOptionEditor.tsx - 備考入力欄のUI追加
- [ ] 3.4 イベント作成画面で備考が保存されることを確認

## フェーズ4: フロントエンド（表示）

- [ ] 4.1 ResponseForm.tsx - 備考表示を追加
- [ ] 4.2 回答ページで備考が表示されることを確認

## フェーズ5: ドキュメント更新

- [ ] 5.1 docs/functional-design.md 更新
- [ ] 5.2 lint/型チェック実行

## 完了条件

- イベント作成時に各候補日に備考を入力できる
- 編集モードで備考を変更できる
- 回答ページで備考が表示される
- 既存イベントが正常に動作する
