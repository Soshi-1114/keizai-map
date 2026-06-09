# KeizaiMap 📊

**数字で見る、日本の30年**

賃金・物価・税収・為替の推移を政権とともに一画面で可視化するWebサービス。
バラバラに語られてきた経済データを重ねることで、「なぜ生活が苦しくなったのか」を数字で見せる。

🔗 **https://keizai-map.vercel.app/**

-----

## 📸 スクリーンショット

> Coming soon

-----

## ✨ 機能

- **指標の重ね表示** — 実質賃金・消費者物価・税収・USD/JPY を自由に組み合わせて表示
- **政権帯表示** — 各政権の期間を帯で色分け表示（自民・非自民・連立）
- **イベントフィルター** — 消費税増税・経済政策・経済ショックをカテゴリ別に表示
- **年度スライダー** — 1990〜2024年の範囲を自由に絞り込み
- **インサイトカード** — データから自動生成した「気づき」を表示
- **ホバー詳細** — 年・各指標の数値・政権名をリアルタイム表示

-----

## 🗂️ リポジトリ構成

```
keizai-map/
├── apps/
│   └── web/                    # Next.js アプリ本体
│       ├── app/                # App Router
│       │   ├── page.tsx        # メインチャート画面
│       │   └── about/
│       │       └── page.tsx    # データソース説明
│       ├── components/
│       │   ├── Chart/          # メインチャート
│       │   ├── AdminBar/       # 政権帯
│       │   ├── RangeSlider/    # 年度スライダー
│       │   ├── EventFilter/    # イベントフィルター
│       │   └── InsightCards/   # インサイトカード
│       └── public/
│
├── packages/
│   ├── data/                   # データ取得・整形スクリプト
│   │   ├── sources/
│   │   │   ├── estat.ts        # e-Stat API（賃金・物価）
│   │   │   ├── mof.ts          # 財務省CSV（税収）
│   │   │   └── boj.ts          # 日銀API（為替）
│   │   └── index.ts
│   └── types/                  # 共通型定義
│       └── index.ts
│
├── .github/
│   └── workflows/
│       └── update-data.yml     # データ自動更新（月次）
│
├── package.json                # ワークスペース設定（pnpm）
└── README.md
```

-----

## 🛠️ 技術スタック

|役割     |技術                    |
|-------|----------------------|
|フレームワーク|Next.js 14（App Router）|
|言語     |TypeScript            |
|グラフ    |Recharts              |
|スタイリング |Tailwind CSS          |
|ホスティング |Vercel                |
|データ更新  |GitHub Actions（月次自動実行）|

-----

## 📊 データソース

|指標       |出典            |取得方法      |
|---------|--------------|----------|
|実質賃金     |厚生労働省 毎月勤労統計調査|e-Stat API|
|消費者物価指数  |総務省統計局        |e-Stat API|
|税収       |財務省           |CSV公開     |
|USD/JPY為替|日本銀行 時系列統計    |CSV公開     |

すべて無料・商用利用可のオープンデータを使用しています。

-----

## 🚀 ローカル開発

```bash
# リポジトリをクローン
git clone https://github.com/Soshi-1114/keizai-map.git
cd keizai-map

# 依存関係インストール
pnpm install

# 開発サーバー起動
pnpm dev

# ブラウザで確認
open http://localhost:3000
```

### 環境変数

```bash
# apps/web/.env.local
ESTAT_API_KEY=your_api_key  # e-Stat APIキー（無料登録）
```

-----

## 🗺️ ロードマップ

### Milestone 1 - MVP

- [ ] Next.jsプロジェクト初期設定
- [ ] e-Stat APIでデータ取得
- [ ] メインチャート実装
- [ ] 政権帯・イベント表示
- [ ] Vercelデプロイ

### Milestone 2 - v1.0

- [ ] アドセンス導入
- [ ] アフィリエイトリンク追加
- [ ] OGP・SNSシェア機能
- [ ] モバイル対応

### Milestone 3 - v2.0

- [ ] 月次データ対応
- [ ] 国際比較モード
- [ ] プレミアムプラン

-----

## 📄 ライセンス

MIT

-----

## 👤 Author

**Soshi** — [@Soshi-1114](https://github.com/Soshi-1114)
