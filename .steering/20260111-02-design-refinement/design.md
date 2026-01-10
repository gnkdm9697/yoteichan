# デザイン洗練化 - 設計

## 1. カラーシステム

### ライトモード
```css
--primary: #4f46e5;        /* 深いインディゴ */
--primary-hover: #4338ca;
--primary-light: #e0e7ff;

--ok: #059669;             /* 深い緑 */
--ok-hover: #047857;
--ok-light: #d1fae5;

--maybe: #d97706;          /* 深いオレンジ */
--maybe-hover: #b45309;
--maybe-light: #fef3c7;

--ng: #dc2626;             /* 深い赤 */
--ng-hover: #b91c1c;
--ng-light: #fee2e2;

--bg: #fffbf7;             /* 温かみのある白 */
--bg-secondary: #faf5f0;
--bg-elevated: #ffffff;

--text: #1a1a1a;           /* 高コントラスト黒 */
--text-secondary: #525252;

--shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
--shadow-md: 0 4px 6px -1px rgba(0,0,0,0.1);
--shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.1);
```

### ダークモード
```css
--primary: #818cf8;
--ok: #34d399;
--maybe: #fbbf24;
--ng: #f87171;

--bg: #0f0f0f;             /* 純黒ではない */
--bg-secondary: #1a1a1a;
--bg-elevated: #262626;

--text: #f5f5f5;
--text-secondary: #a3a3a3;
```

## 2. タイポグラフィ

### フォント
- **本文:** Noto Sans JP（日本語最適化）
- **代替:** system-ui, sans-serif

### サイズスケール
| 用途 | 現在 | 変更後 |
|------|------|--------|
| ラベル | text-sm (14px) | text-base (16px) |
| 本文 | text-base (16px) | text-lg (18px) |
| 見出し小 | text-lg (18px) | text-xl (20px) |
| 見出し大 | text-2xl (24px) | text-3xl (30px) |

## 3. コンポーネントサイズ

### Button
| サイズ | 現在 | 変更後 |
|--------|------|--------|
| sm | h-9 (36px) | min-h-[44px] |
| md | h-11 (44px) | min-h-[52px] |
| lg | h-12 (48px) | min-h-[56px] |

追加スタイル:
- `shadow-sm`
- `active:scale-[0.98]`
- `transition-all duration-150`

### Input/Textarea
- 高さ: 44px → 52px
- ラベル: text-sm → text-base
- パディング: px-3 → px-4

### StatusButton
- サイズ: 44px → 56px
- シンボル: text-xl → text-3xl
- 非アクティブ時も薄い背景色

### CalendarDay
- サイズ: 44px → 48px
- フォント: text-sm → text-base

## 4. 対象ファイル

### Phase 1: 基盤
- `src/app/globals.css` - CSS変数
- `src/app/layout.tsx` - フォント設定

### Phase 2: UIコンポーネント
- `src/components/ui/Button.tsx`
- `src/components/ui/Input.tsx`
- `src/components/ui/Textarea.tsx`

### Phase 3: 機能コンポーネント
- `src/components/features/StatusButton.tsx`
- `src/components/features/Calendar.tsx`
- `src/components/features/CalendarDay.tsx`

### Phase 4: テーブル
- `src/components/features/ResponseTable.tsx`
- `src/components/features/ResponseRow.tsx`
- `src/components/features/SummaryRow.tsx`

### Phase 5: モーダル
- `src/components/ui/Modal.tsx`
- `src/components/ui/Toast.tsx`

### Phase 6: ページ
- `src/app/page.tsx`
- `src/app/new/page.tsx`
- `src/app/e/[publicId]/page.tsx`
- `src/app/e/[publicId]/EventEditSection.tsx`
- `src/app/e/[publicId]/EventResponseSection.tsx`

### Phase 7: テーマ切り替え
- `src/app/layout.tsx` - ThemeProvider追加
- 新規: `src/components/ui/ThemeToggle.tsx`

## 5. ダークモード実装方式

### 方式
`data-theme`属性 + CSS変数

```tsx
// layout.tsx
<html data-theme={theme}>
```

### 検出ロジック
1. localStorage確認
2. なければ `prefers-color-scheme` 使用
3. 手動切り替え時はlocalStorageに保存
