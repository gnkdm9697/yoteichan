# UX改善 実装プロンプト

## 概要
`.steering/20260111-03-ux-improvements/`の計画に従ってUX改善を実装する。
サブエージェントを活用して効率的に進める。

## 参照ドキュメント
- 要件: `.steering/20260111-03-ux-improvements/requirements.md`
- 設計: `.steering/20260111-03-ux-improvements/design.md`
- タスク: `.steering/20260111-03-ux-improvements/tasklist.md`

---

## 実装手順

### Phase 1: クイック修正（直接実装）

簡単な修正なのでサブエージェントは使わず直接実装する。

**タスク:**
1. `src/components/features/DateOptionEditor.tsx:40` - `useState(false)` → `useState(true)`
2. 時間表示の確認（秒が表示されていないか）
3. `src/components/features/ResponseForm.tsx` - 日付と回答ボタンを横並びに変更

**完了後:** ビルド確認 (`npm run build`)

---

### Phase 2: 表の転置

**使用エージェント:** `frontend-skills:frontend-design-system-implementer`

**指示内容:**
```
ResponseTableの表構造を転置してほしい。

現状: 行=参加者名、列=日付
変更後: 行=日付、列=参加者名

設計は `.steering/20260111-03-ux-improvements/design.md` の「1. 回答画面の表転置」を参照。

修正対象ファイル:
- src/components/features/ResponseTable.tsx
- src/components/features/ResponseRow.tsx（必要に応じて）
- src/components/features/SummaryRow.tsx（必要に応じて）

要件:
- ヘッダー行: 最初のセルは「日付」、その後に参加者名を列として表示
- ボディ行: 各行は日付単位、セルは各参加者の回答（○△×）
- 集計: 各行の末尾セルに表示（または最終列として）
- 横スクロール対応を維持
- ベスト日付のハイライト機能を維持
```

**完了後:** `pro-code-reviewer` でレビュー

---

### Phase 3: 回答編集機能

#### Step 3.1: 設計確認
**使用エージェント:** `feature-dev:code-architect`

**指示内容:**
```
回答編集機能の実装設計をレビューしてほしい。

要件:
- 誰でも任意の参加者の回答をクリックして編集できる
- 編集時は既存の名前と回答が入力済みの状態
- 送信後も編集を開くと前回の回答が保持される

設計は `.steering/20260111-03-ux-improvements/design.md` の「2. 回答編集機能」を参照。

以下を確認・提案してほしい:
1. 状態管理の設計は適切か
2. コンポーネント間のデータフローに問題はないか
3. 既存APIで対応可能か（新規APIが必要か）
```

#### Step 3.2: 実装
**使用エージェント:** `frontend-skills:frontend-design-system-implementer`

**指示内容:**
```
回答編集機能を実装してほしい。

設計は `.steering/20260111-03-ux-improvements/design.md` の「2. 回答編集機能」を参照。

修正対象ファイル:
- src/app/e/[publicId]/EventResponseSection.tsx - 編集状態管理
- src/components/features/ResponseForm.tsx - initialName, initialAnswers props追加
- src/components/features/ResponseTable.tsx - 名前クリックハンドラ追加

要件:
1. ResponseTableの参加者名をクリック可能に
2. クリックでEventResponseSectionの編集状態を更新
3. ResponseFormに初期値を渡して表示
4. 送信成功後、テーブルを更新（router.refresh()）
```

**完了後:** `pro-code-reviewer` でレビュー

---

### Phase 4: 日付オプション改善

#### Step 4.1: DB変更
手動でSupabaseダッシュボードから実行、またはマイグレーションファイル作成:

```sql
ALTER TABLE date_options ADD COLUMN title TEXT;
```

#### Step 4.2: 型定義更新
直接実装:
- `src/types/database.ts` - title追加
- `src/types/index.ts` - DateOption, CreateDateOptionInput更新

#### Step 4.3: UI実装
**使用エージェント:** `frontend-skills:frontend-design-system-implementer`

**指示内容:**
```
TimeSlotPickerを改善してほしい。

設計は `.steering/20260111-03-ux-improvements/design.md` の「3. 候補日タイトル機能」「4. 日付カードのリスト表示」を参照。

修正対象ファイル:
- src/components/features/TimeSlotPicker.tsx

要件:
1. 各日付にタイトル入力欄を追加
2. 個別カード → 1枚のカード内にリスト形式で表示
3. 背景色を交互に（odd/even）してコントラストをつける
4. コンパクトなレイアウト（日付、時間、タイトル、削除ボタンを1行に）
5. 終日チェックボックスと時間入力は展開/折りたたみ可能に
```

#### Step 4.4: API更新
直接実装:
- `src/app/api/events/route.ts` - title対応
- `src/app/api/events/[publicId]/route.ts` - title対応

#### Step 4.5: 表示対応
**使用エージェント:** `frontend-skills:frontend-design-system-implementer`

**指示内容:**
```
回答画面で日付オプションのタイトルを表示してほしい。

修正対象ファイル:
- src/components/features/ResponseTable.tsx - ヘッダーにタイトル表示
- src/components/features/ResponseForm.tsx - 日付ラベルにタイトル表示

要件:
- タイトルがある場合のみ表示
- 日付の下または横にサブテキストとして表示
```

**完了後:** `pro-code-reviewer` でレビュー

---

### 最終確認

**使用エージェント:** `code-simplifier:code-simplifier`

**指示内容:**
```
今回の実装で変更したファイルをレビューして、不要なコードや改善できる箇所があれば整理してほしい。

対象ファイル:
- src/components/features/ResponseTable.tsx
- src/components/features/ResponseForm.tsx
- src/components/features/TimeSlotPicker.tsx
- src/app/e/[publicId]/EventResponseSection.tsx
```

---

## 検証チェックリスト

実装完了後、以下を確認:

- [ ] `npm run build` 成功
- [ ] イベント作成 → 日付選択 → タイトル入力 → 保存
- [ ] 回答画面で表が転置されている
- [ ] 参加者名クリック → 編集フォームが開く
- [ ] 編集して保存できる
- [ ] 編集モードでカレンダーがデフォルト表示
- [ ] モバイル表示確認

---

## 注意事項

1. **各Phase完了後にビルド確認** - 壊れたまま進めない
2. **既存のスタイルシステムを維持** - CSS変数（`var(--xxx)`）を使う
3. **レスポンシブ対応** - `sm:` プレフィックスでモバイル対応
4. **型安全** - TypeScriptの型を適切に更新
5. **DB変更は慎重に** - null許容で後方互換性を維持
