# Design: 回答者名のローカルストレージ保存

## 実装方針
ResponseForm内に直接実装（カスタムフック化しない）
- 使用箇所が1箇所のみ
- ThemeToggleと同じパターンで統一感
- 約10行の追加でシンプル

## 変更対象
- `src/components/features/ResponseForm.tsx`

## 技術設計

### ストレージキー
```typescript
const STORAGE_KEY_RESPONDER_NAME = 'yoteichan_responder_name';
```

### 読み込み処理（useEffect）
```typescript
useEffect(() => {
  if (initialName) return; // 編集モードでは復元しない
  const savedName = localStorage.getItem(STORAGE_KEY_RESPONDER_NAME);
  if (savedName) {
    setName(savedName);
  }
}, [initialName]);
```

### 保存処理（送信成功時）
```typescript
localStorage.setItem(STORAGE_KEY_RESPONDER_NAME, name.trim());
```

## 動作フロー
```
初回: マウント → useEffect → 値なし → ユーザー入力 → 送信成功 → 保存
2回目: マウント → useEffect → 値あり → 自動入力 → 必要なら編集 → 送信
```

## SSR対応
- useEffect内でのみlocalStorageにアクセス
- ハイドレーション不一致の問題なし（UIの見た目は変わらない）
