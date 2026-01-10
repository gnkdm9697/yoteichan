# 予定ちゃん

スマホで簡単に予定調整ができるウェブアプリ。

## セットアップ

1. 依存関係のインストール
```bash
npm install
```

2. 環境変数の設定
```bash
cp .env.local.example .env.local
# .env.local を編集して Supabase の情報を入力
```

3. Supabase でテーブル作成
```bash
# supabase/migrations/001_create_tables.sql を実行
```

4. 開発サーバー起動
```bash
npm run dev
```

## デプロイ

Vercel推奨。環境変数を設定してデプロイ。
