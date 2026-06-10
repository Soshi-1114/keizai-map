export interface ArticleMeta {
  slug: string;
  title: string;
  description: string;
  readingTime: number;
  tags: string[];
}

export const ARTICLES: ArticleMeta[] = [
  {
    slug: "real-wages",
    title: "実質賃金とは？名目賃金との違いと日本の30年",
    description:
      "実質賃金と名目賃金の違いを解説。1990年を100とした場合、2024年の実質賃金は99.2と横ばいである一方、物価は約20%上昇した。日本の賃金停滞の実態をデータで確認する。",
    readingTime: 4,
    tags: ["賃金", "物価", "生活水準"],
  },
  {
    slug: "consumption-tax",
    title: "消費税率引き上げの歴史と家計への影響",
    description:
      "1989年の3%導入から2019年の10%まで、消費税率はどのように変化し、家計や経済にどんな影響を与えてきたか。消費者物価指数のデータとあわせて振り返る。",
    readingTime: 4,
    tags: ["消費税", "税収", "物価"],
  },
  {
    slug: "abenomics",
    title: "アベノミクスとは何か ─ 3本の矢と経済指標の変化",
    description:
      "2012年末に始まったアベノミクスの「3本の矢」を解説。8年間で税収は43.9兆円から60.8兆円へ増加し、円安も大幅に進んだ。実質賃金への影響はどうだったか。",
    readingTime: 5,
    tags: ["アベノミクス", "金融政策", "税収"],
  },
  {
    slug: "yen-depreciation",
    title: "円安が進む仕組みと日本経済への影響",
    description:
      "2012年の1ドル=79.8円から2024年の151.8円まで、なぜ円安が進んだのか。日米金利差、日銀の金融政策との関係と、輸出企業・輸入消費者への影響を解説する。",
    readingTime: 4,
    tags: ["為替", "円安", "日銀"],
  },
  {
    slug: "lost-decades",
    title: "「失われた30年」─ 数字で見る日本経済の停滞",
    description:
      "バブル崩壊（1991年）から現在まで、日本経済の何が「失われた」のか。実質賃金・物価・税収・為替の推移をデータで俯瞰し、長期停滞の構造を読み解く。",
    readingTime: 5,
    tags: ["バブル崩壊", "デフレ", "長期停滞"],
  },
];
