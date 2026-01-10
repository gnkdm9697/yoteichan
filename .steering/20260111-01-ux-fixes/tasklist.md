# UX修正 - タスクリスト

## 1. 合言葉入力の改善
- [x] PassphraseModal.tsx: `type="text"` に変更

## 2. デフォルト時間変更
- [x] new/page.tsx: デフォルトを `startTime: '19:00', endTime: '21:00'` に

## 3. 回答フォーム折りたたみ
- [x] EventResponseSection.tsx: isCollapsed状態追加
- [x] 回答送信後に自動で折りたたむ
- [x] トグルUI実装

## 完了チェック
- [x] 合言葉で日本語入力できる
- [x] 新規予定がデフォルト19:00〜21:00
- [x] 回答後にフォームを折りたためる
