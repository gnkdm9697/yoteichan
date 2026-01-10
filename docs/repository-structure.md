# 予定ちゃん - リポジトリ構成

## ディレクトリ構造

```
yoteichan/
├── .claude/
│   └── CLAUDE.md           # Claude Code 設定
├── .steering/              # 作業単位のドキュメント
│   └── [YYYYMMDD]-[No]-[title]/
│       ├── requirements.md
│       ├── design.md
│       └── tasklist.md
├── docs/                   # 永続ドキュメント
│   ├── product-requirements.md
│   ├── functional-design.md
│   ├── architecture.md
│   ├── repository-structure.md
│   ├── development-guidelines.md
│   └── glossary.md
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── new/
│   │   │   └── page.tsx
│   │   ├── e/
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   └── api/
│   │       └── events/
│   │           ├── route.ts
│   │           └── [publicId]/
│   │               ├── route.ts
│   │               ├── verify/
│   │               │   └── route.ts
│   │               └── responses/
│   │                   └── route.ts
│   ├── components/         # UIコンポーネント
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Textarea.tsx
│   │   │   └── Modal.tsx
│   │   ├── calendar/
│   │   │   ├── Calendar.tsx
│   │   │   ├── CalendarDay.tsx
│   │   │   └── TimeSlotPicker.tsx
│   │   ├── response/
│   │   │   ├── ResponseForm.tsx
│   │   │   ├── ResponseTable.tsx
│   │   │   └── StatusButton.tsx
│   │   └── edit/
│   │       ├── PassphraseModal.tsx
│   │       └── EditForm.tsx
│   ├── lib/                # ユーティリティ
│   │   ├── supabase.ts
│   │   └── utils.ts
│   └── types/              # 型定義
│       └── index.ts
├── public/                 # 静的ファイル
├── .env.local              # 環境変数（gitignore）
├── .env.example            # 環境変数サンプル
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## ディレクトリの役割

| ディレクトリ | 役割 |
|-------------|------|
| `.claude/` | Claude Code の設定 |
| `.steering/` | 作業単位の計画ドキュメント |
| `docs/` | 永続的な設計ドキュメント |
| `src/app/` | ページとAPIルート |
| `src/components/` | 再利用可能なコンポーネント |
| `src/lib/` | ユーティリティ関数 |
| `src/types/` | TypeScript 型定義 |

## ファイル配置ルール

- コンポーネントは機能ごとにサブディレクトリに分ける
- 1ファイル1コンポーネント
- 型定義は `types/index.ts` に集約
- API ルートは REST 風のパス構成
