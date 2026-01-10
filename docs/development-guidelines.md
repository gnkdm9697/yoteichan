# 予定ちゃん - 開発ガイドライン

## コーディング規約

### 基本
- インデント: スペース2つ
- 改行コード: LF
- 文字コード: UTF-8
- コメントは日本語OK

### TypeScript
- `any` 禁止、型は明示的に定義
- `interface` を優先（`type` は union 等に使用）
- オプショナルチェーン (`?.`) を活用

### React / Next.js
- 関数コンポーネントのみ使用
- `'use client'` は必要な場合のみ
- Props は destructuring で受け取る

```tsx
// Good
export function Button({ label, onClick }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>;
}

// Bad
export function Button(props: ButtonProps) {
  return <button onClick={props.onClick}>{props.label}</button>;
}
```

### 命名規則

| 対象 | 規則 | 例 |
|------|------|-----|
| コンポーネント | PascalCase | `ResponseTable` |
| 関数 | camelCase | `handleSubmit` |
| 定数 | UPPER_SNAKE_CASE | `MAX_TITLE_LENGTH` |
| ファイル（コンポーネント） | PascalCase | `Button.tsx` |
| ファイル（その他） | kebab-case | `utils.ts` |

## スタイリング

### Tailwind CSS
- ユーティリティクラスを直接使用
- 繰り返しが多い場合は `@apply` でまとめる
- レスポンシブは `sm:`, `md:`, `lg:` プレフィックス

```tsx
// Good
<button className="bg-primary text-white px-4 py-2 rounded-lg">

// カスタムクラスが必要な場合
// globals.css
.btn-primary {
  @apply bg-primary text-white px-4 py-2 rounded-lg;
}
```

## Git 規約

### ブランチ
- `main`: 本番
- `feature/xxx`: 機能開発
- `fix/xxx`: バグ修正

### コミットメッセージ
- 日本語OK
- 簡潔に変更内容を記述

```
機能: イベント作成機能を追加
修正: カレンダーの日付選択バグを修正
改善: レスポンス速度を改善
```

### 禁止事項
- `.env` ファイルのコミット
- 機密情報のハードコード

## テスト

### 方針
- 最小限のテストから始める
- 重要なロジックのみユニットテスト
- E2E テストは後から追加

## エラーハンドリング

```tsx
// API レスポンス
try {
  const data = await fetchEvent(id);
  return data;
} catch (error) {
  console.error('Failed to fetch event:', error);
  throw new Error('イベントの取得に失敗しました');
}
```

## パフォーマンス

- 画像は `next/image` を使用
- 不要な再レンダリングを避ける
- API 呼び出しは必要最小限に
