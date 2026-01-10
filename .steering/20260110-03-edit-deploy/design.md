# Phase 3: 編集・仕上げ - 設計

## 追加ディレクトリ構成

```
src/
├── components/
│   ├── ui/
│   │   ├── Toast.tsx            # トースト通知
│   │   ├── ConfirmDialog.tsx    # 確認ダイアログ
│   │   └── Loading.tsx          # ローディング
│   └── edit/
│       ├── PassphraseModal.tsx  # 合言葉入力モーダル
│       ├── EditForm.tsx         # 編集フォーム
│       └── DateOptionEditor.tsx # 候補日編集
├── hooks/
│   └── useToast.ts              # トースト管理
└── app/
    └── api/
        └── events/
            └── [publicId]/
                ├── verify/
                │   └── route.ts  # 合言葉検証
                └── route.ts      # PUT/DELETE 追加
```

## API エンドポイント

### POST /api/events/[publicId]/verify
合言葉検証

**Request:**
```json
{
  "passphrase": "ひみつ123"
}
```

**Response:**
```json
{
  "valid": true
}
```

### PUT /api/events/[publicId]
イベント更新

**Request:**
```json
{
  "passphrase": "ひみつ123",
  "title": "新年会（変更）",
  "location": "新宿駅周辺",
  "description": "場所変更しました",
  "dateOptions": [
    { "id": "uuid-1", "date": "2025-01-08", "startTime": null, "endTime": null },
    { "date": "2025-01-10", "startTime": "18:00", "endTime": "20:00" }
  ]
}
```

### DELETE /api/events/[publicId]
イベント削除

**Request:**
```json
{
  "passphrase": "ひみつ123"
}
```

## コンポーネント設計

### PassphraseModal
- 合言葉入力フィールド
- 「確認する」ボタン
- エラーメッセージ表示
- 閉じるボタン

### EditForm
- 通常の表示モードと編集モードを切り替え
- 編集モード時は入力フィールドを表示
- 保存/キャンセル/削除ボタン

### DateOptionEditor
- 既存候補日のリスト表示
- 各候補日に削除ボタン
- 「候補日を追加」ボタン → カレンダー表示

### Toast
- 成功/エラー/情報の3種類
- 自動で消える（3秒）
- 画面上部に表示

### ConfirmDialog
- タイトル/メッセージ
- 確認/キャンセルボタン
- 削除時は赤いボタン

## 状態管理

```tsx
// イベント詳細ページの状態
const [isEditMode, setIsEditMode] = useState(false);
const [showPassphraseModal, setShowPassphraseModal] = useState(false);
const [editData, setEditData] = useState<EditEventData | null>(null);
```

## デプロイ設定

### Vercel
- GitHub リポジトリ連携
- 環境変数:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`（必要に応じて）

### ドメイン
- デフォルト: `yoteichan.vercel.app`
- カスタムドメイン: 任意
