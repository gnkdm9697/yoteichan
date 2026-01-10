# 予定ちゃん - 用語集

## ドメイン用語

| 日本語 | 英語 | 説明 |
|--------|------|------|
| イベント | Event | 予定調整の対象となる集まり |
| 候補日 | Date Option | イベントの開催候補となる日時 |
| 回答 | Response | 参加者の出欠回答 |
| 合言葉 | Passphrase | イベント編集用のパスワード |
| 作成者 | Creator | イベントを作成した人 |
| 参加者 | Participant | イベントに回答する人 |

## 回答ステータス

| 表示 | コード | 意味 |
|------|--------|------|
| ○ | `ok` | 参加可能 |
| △ | `maybe` | たぶん参加可能 |
| × | `ng` | 参加不可 |

## 技術用語

| 用語 | 説明 |
|------|------|
| public_id | URLに使用する短いランダム文字列 |
| date_option | 候補日のDBレコード |
| RLS | Row Level Security（行レベルセキュリティ） |

## コード命名規則

### コンポーネント

| 日本語 | コンポーネント名 |
|--------|-----------------|
| カレンダー | `Calendar` |
| 日付セル | `CalendarDay` |
| 時間帯選択 | `TimeSlotPicker` |
| 回答フォーム | `ResponseForm` |
| 回答テーブル | `ResponseTable` |
| ステータスボタン | `StatusButton` |
| 合言葉モーダル | `PassphraseModal` |
| 編集フォーム | `EditForm` |

### API

| 機能 | エンドポイント |
|------|---------------|
| イベント作成 | `POST /api/events` |
| イベント取得 | `GET /api/events/[publicId]` |
| 合言葉検証 | `POST /api/events/[publicId]/verify` |
| イベント更新 | `PUT /api/events/[publicId]` |
| イベント削除 | `DELETE /api/events/[publicId]` |
| 回答登録 | `POST /api/events/[publicId]/responses` |

### 型定義

| 用途 | 型名 |
|------|------|
| 回答ステータス | `ResponseStatus` |
| イベント作成リクエスト | `CreateEventRequest` |
| イベントレスポンス | `EventResponse` |
| 候補日入力 | `DateOptionInput` |
| 参加者の回答 | `ParticipantResponse` |
