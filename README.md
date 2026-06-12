# KeizaiMap 📊

**数字で見る、日本の30年**

実質賃金・物価・税収・為替・日経平均・住宅価格・国債残高・出生数・社会保険料の推移を、政権帯とともに一画面で重ね見できる経済データダッシュボード。バラバラに語られてきた経済データを重ねることで、「なぜ生活が苦しくなったのか」を数字で見せる。

🔗 **https://keizaimap.jp/**

-----

## 📸 スクリーンショット

> Coming soon

-----

## ✨ 機能

- **9指標の重ね表示** — 実質賃金 / 消費者物価 / 税収 / USD/JPY / 日経平均 / 住宅価格 / 国債残高 / 出生数 / 社会保険料負担率 を自由に組み合わせて表示
- **政権帯表示** — 各政権の期間を帯で色分け表示（自民・非自民・連立）
- **イベントフィルター** — 税制 / 経済 / 経済政策 をカテゴリ別に表示
- **年度スライダー** — 1990〜2024年の範囲を自由に絞り込み
- **年代ショートカット** — 失われた30年・アベノミクスなど主要期間にワンタップ移動
- **インサイトカード** — 選択期間の現在値と期間変化を自動算出
- **G7比較ビュー** — 日本 vs G7平均 の実質賃金・CPI を重ね表示
- **CSVダウンロード** — 表示中の年度範囲・指標のデータをエクスポート
- **ブックマーク / 最近見た設定** — URLクエリ単位で保存・呼び戻し
- **ダークモード** — システム設定追従・手動切替対応（next-themes）
- **モバイル最適化** — フィルターシート・指標切替ナビ・横スクロール抑制
- **PWA対応** — ホーム画面追加・オフライン表示
- **解説記事 30本** — 各指標の背景・関連事象・プリセット付きで深掘り
- **SEO / OGP** — 動的OG画像・サイトマップ・RSSフィード・JSON-LD（FAQPage / BreadcrumbList / Organization）

-----

## 🗂️ リポジトリ構成

```
keizai-map/
├── apps/
│   └── web/                          # Next.js アプリ本体
│       ├── app/                      # App Router
│       │   ├── page.tsx              # メインダッシュボード
│       │   ├── layout.tsx            # ルート（GA / PWA / メタデータ）
│       │   ├── about/                # サービス概要・データ出典
│       │   ├── articles/             # 解説記事インデックス + 30記事
│       │   ├── contact/              # お問い合わせ
│       │   ├── privacy/              # プライバシーポリシー
│       │   ├── og/                   # OG画像（動的生成）
│       │   ├── feed.xml/             # RSSフィード
│       │   ├── sitemap.ts            # サイトマップ
│       │   ├── robots.ts             # robots.txt
│       │   ├── icon.svg / icon-192 / icon-512 / apple-icon
│       │   └── globals.css
│       ├── components/
│       │   ├── MainView.tsx          # 状態管理の中核
│       │   ├── Chart/                # Recharts メインチャート（二軸）
│       │   ├── AdminBar/             # 政権帯
│       │   ├── RangeSlider/          # デュアルハンドル年度スライダー
│       │   ├── EraShortcuts/         # 年代ショートカット
│       │   ├── EventFilter/          # イベントフィルター
│       │   ├── InsightCards/         # 期間変化カード
│       │   ├── ComparisonView/       # G7比較ビュー
│       │   ├── LiveDataBox/          # 最新値ハイライト
│       │   ├── DataTable/            # 数値テーブル / CSV書き出し
│       │   ├── BookmarkPanel/        # ブックマーク・履歴
│       │   ├── MobileFiltersSheet/   # モバイル用ボトムシート
│       │   ├── MobileIndicatorNav/   # モバイル用指標切替
│       │   ├── ArticleLayout/        # 記事共通レイアウト
│       │   ├── ThemeProvider.tsx     # ダークモード（next-themes）
│       │   └── ThemeToggle.tsx
│       ├── lib/
│       │   ├── data.ts               # データ・政権・イベント定義
│       │   ├── data.generated.json   # GitHub Actions が更新する数値
│       │   ├── articles.ts           # 記事メタ情報
│       │   ├── comparison-data.ts    # G7比較データ
│       │   ├── bookmarks.ts          # localStorage 操作
│       │   ├── csv.ts                # CSV書き出し
│       │   ├── jsonld.ts             # 構造化データ生成
│       │   ├── constants.ts          # カラー・チャート設定
│       │   ├── hooks.ts / utils.ts / types.ts
│       ├── e2e/                      # Playwright E2E
│       │   ├── dashboard.spec.ts
│       │   ├── articles.spec.ts
│       │   ├── navigation.spec.ts
│       │   ├── mobile.spec.ts
│       │   └── mobile-overflow.spec.ts
│       └── public/                   # manifest.json / robots.txt
│
├── packages/
│   └── data/                         # データ取得スクリプト（@keizai-map/data-fetcher）
│       └── src/
│           ├── fetch.ts              # エントリポイント
│           └── fetchers/
│               ├── estat.ts          # e-Stat API（CPI・出生数）
│               ├── boj.ts            # 日銀 CSV（USD/JPY）
│               ├── mof.ts            # 財務省 CSV（税収・国債残高）
│               ├── fallback.ts       # 取得失敗時の確定値
│               └── utils.ts
│
├── .github/
│   └── workflows/
│       └── update-data.yml           # 月次自動更新（毎月1日 JST 09:00）
│
├── pnpm-workspace.yaml
├── package.json
└── README.md
```

-----

## 🛠️ 技術スタック

| 役割          | 技術                                            |
|---------------|------------------------------------------------|
| フレームワーク | Next.js 14.2（App Router）                     |
| 言語          | TypeScript 5                                    |
| グラフ        | Recharts 2（ComposedChart + 二軸 YAxis）         |
| スタイリング  | Tailwind CSS 3                                  |
| テーマ        | next-themes（ライト/ダーク）                     |
| E2Eテスト     | Playwright                                      |
| パッケージ管理 | pnpm 9（モノレポ workspace）                    |
| ホスティング  | Vercel（独自ドメイン: keizaimap.jp）             |
| データ自動更新 | GitHub Actions（月次 cron）                     |
| 分析          | Google Analytics 4（G-L3881RG05D）              |

-----

## 📊 データソース

| 指標              | 出典                              | 取得方法                         |
|-------------------|----------------------------------|---------------------------------|
| 実質賃金指数      | 厚生労働省 毎月勤労統計調査       | 手動更新（API非公開）            |
| 消費者物価指数    | 総務省統計局 消費者物価指数       | 🟢 e-Stat API（自動）            |
| 税収              | 財務省 一般会計税収決算           | 🟢 MOF CSV（自動 / fallback）    |
| USD/JPY 為替      | 日本銀行 時系列統計データ         | 🟢 BOJ CSV（自動 / fallback）    |
| 日経平均株価      | 取引所公開資料 / 日本経済新聞社   | 手動更新                         |
| 住宅価格指数      | 国土交通省 不動産価格指数         | 手動更新                         |
| 国債残高          | 財務省 国債統計年報               | 🟢 MOF CSV（自動 / fallback）    |
| 出生数            | 厚生労働省 人口動態調査           | 🟢 e-Stat API（自動）            |
| 社会保険料負担率  | 厚生労働省 / 財務省 国民負担率推移 | 手動更新（年1回）                |
| G7平均 実質賃金   | OECD Real Average Wages           | 手動更新                         |
| G7平均 CPI        | OECD Inflation (HICP)             | 手動更新                         |

- 1990〜2024年の **年次データ** を掲載
- すべて **無料・商用利用可** のオープンデータ
- 自動取得が失敗した場合は `fallback.ts` の確定値にフォールバック（連続性確保）
- 詳細は [/about](https://keizaimap.jp/about) を参照

-----

## 🚀 ローカル開発

```bash
# リポジトリをクローン
git clone https://github.com/Soshi-1114/keizai-map.git
cd keizai-map

# 依存関係インストール
pnpm install

# Web アプリを起動
pnpm dev

# ブラウザで確認
open http://localhost:3000
```

### 主なコマンド

```bash
# 開発サーバー起動
pnpm dev

# 本番ビルド
pnpm build

# ESLint
pnpm lint

# データ取得スクリプト（e-Stat / BOJ / MOF）
pnpm data:fetch

# E2E テスト（apps/web で実行）
pnpm --filter web test:e2e
pnpm --filter web test:e2e:ui
pnpm --filter web test:e2e:report
```

### 環境変数

ルートから `apps/web/.env.local` を作成してください。

```bash
ESTAT_API_KEY=your_api_key       # e-Stat APIキー（無料登録）
NEXT_PUBLIC_SITE_URL=https://keizaimap.jp   # 任意（OGP/sitemap のベースURL）
```

`ESTAT_API_KEY` は CPI・出生数の自動取得に必要です。未設定でも fallback で動作します。
GitHub Actions では `secrets.ESTAT_API_KEY` を参照します。

-----

## 🗺️ ロードマップ

### ✅ Milestone 1 — MVP（完了）

- [x] Next.js プロジェクト初期設定（pnpm モノレポ）
- [x] 9指標のチャート実装（Recharts ComposedChart + 二軸）
- [x] 政権帯・イベント参照線・年代ショートカット
- [x] e-Stat / BOJ / MOF からの自動データ取得
- [x] GitHub Actions による月次自動更新
- [x] Vercel デプロイ・独自ドメイン（keizaimap.jp）取得

### ✅ Milestone 2 — コンテンツ・体験強化（完了）

- [x] 解説記事 30本（プリセットクエリ付き）
- [x] G7比較ビュー
- [x] ブックマーク / 最近見た設定
- [x] CSVダウンロード
- [x] ダークモード
- [x] モバイル最適化（フィルターシート・横スクロール抑制）
- [x] PWA化（manifest / アイコン / オフライン対応）
- [x] OGP・動的OG画像・サイトマップ・RSS・JSON-LD
- [x] Playwright E2E テスト
- [x] About ページ（データ出典・運営者情報）

### 🚧 Milestone 3 — 拡張

- [ ] 月次データ対応
- [ ] 国際比較モード拡張（G7以外）
- [ ] アドセンス / アフィリエイト
- [ ] プレミアムプラン

-----

## 📄 ライセンス

MIT

-----

## 👤 Author

**Soshi** — [@Soshi-1114](https://github.com/Soshi-1114)
