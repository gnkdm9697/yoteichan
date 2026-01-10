# デザイン洗練化 - タスクリスト

## Phase 1: 基盤（高インパクト・低工数）

### 1.1 globals.css - カラーシステム
- [x] ライトモードCSS変数を温かみのある配色に更新
- [x] ステータス色（OK/Maybe/NG）をより鮮明に
- [x] シャドウ変数追加
- [x] `[data-theme="dark"]`セレクタでダークモード変数追加

### 1.2 layout.tsx - タイポグラフィ
- [x] Noto Sans JPフォント追加
- [x] ベースフォントサイズを18px（text-lg）に
- [x] ThemeProvider設定

---

## Phase 2: UIコンポーネント（高インパクト・中工数）

### 2.1 Button.tsx
- [x] 最小高さ変更: sm=44px, md=52px, lg=56px
- [x] `active:scale-[0.98]` プレスフィードバック
- [x] シャドウ追加
- [x] フォントサイズ拡大

### 2.2 Input.tsx
- [x] 高さ52px以上に
- [x] ラベルをtext-baseに
- [x] パディング拡大

### 2.3 Textarea.tsx
- [x] Input.tsxと同様の変更

---

## Phase 3: 機能コンポーネント（高インパクト・中工数）

### 3.1 StatusButton.tsx
- [x] サイズ56pxに拡大
- [x] シンボルtext-3xlに
- [x] 非アクティブ時も薄い背景色
- [x] プレスアニメーション

### 3.2 Calendar.tsx
- [x] ナビゲーションボタン48px
- [x] 月/年ヘッダーフォント拡大
- [x] セル間パディング拡大

### 3.3 CalendarDay.tsx
- [x] サイズ48pxに
- [x] フォントtext-baseに
- [x] 選択時シャドウ

---

## Phase 4: テーブル（中インパクト・中工数）

### 4.1 ResponseTable.tsx
- [x] セルパディング拡大
- [x] フォントサイズ拡大
- [x] 列間ボーダー追加

### 4.2 ResponseRow.tsx
- [x] ステータスシンボルtext-2xlに

### 4.3 SummaryRow.tsx
- [x] フォント拡大
- [x] ベスト日付ハイライト強化

---

## Phase 5: モーダル・トースト（中インパクト・低工数）

### 5.1 Modal.tsx
- [x] 閉じるボタン48px
- [x] タイトルフォント拡大
- [x] シャドウ強化

### 5.2 Toast.tsx
- [x] フォント拡大
- [x] パディング拡大

---

## Phase 6: ページ調整（中インパクト・低工数）

### 6.1 page.tsx（ホーム）
- [x] タイトルフォント拡大
- [x] スペーシング拡大

### 6.2 new/page.tsx
- [x] セクション間gap拡大
- [x] カードにシャドウ追加

### 6.3 e/[publicId]/page.tsx
- [x] 見出しサイズ拡大
- [x] カードシャドウ追加

### 6.4 EventEditSection.tsx
- [x] スペーシング調整

### 6.5 EventResponseSection.tsx
- [x] スペーシング調整

---

## Phase 7: テーマ切り替え（高インパクト・中工数）

- [x] ThemeToggle.tsx新規作成
- [x] システム設定検出
- [x] localStorage保存
- [x] トグルUIを各ページに配置

---

## 検証チェックリスト

- [x] ビルド成功確認
- [ ] モバイル375px幅で表示確認
- [ ] タッチターゲット44px以上
- [ ] コントラスト比確認
- [ ] ダークモード全画面確認
- [ ] フォーカスインジケーター視認性
- [ ] ブラウザフォントサイズ拡大設定でテスト
