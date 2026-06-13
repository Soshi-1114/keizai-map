export interface ArticleMeta {
  slug: string;
  /** ISO日付 YYYY-MM-DD */
  publishedAt: string;
  updatedAt: string;
  title: string;
  description: string;
  readingTime: number;
  tags: string[];
  presetQuery?: string;
}

export const ARTICLES: ArticleMeta[] = [
  {
    slug: "real-wages",
    publishedAt: "2026-06-11",
    updatedAt: "2026-06-12",
    title: "実質賃金とは？なぜ日本人の生活は豊かになった実感がないのか",
    description:
      "実質賃金とは、物価変動を考慮した賃金です。給料が10%増えても物価が20%上がれば、実際に買える商品は減ってしまいます。日本の実質賃金の推移を確認します。",
    readingTime: 3,
    tags: ["賃金", "物価", "生活水準"],
    presetQuery: "?indicators=wage,cpi&range=1990,2024&events=税制",
  },
  {
    slug: "consumption-tax",
    publishedAt: "2026-06-11",
    updatedAt: "2026-06-12",
    title: "消費税率引き上げの歴史と家計への影響",
    description:
      "1989年の3%導入から2019年の10%まで、消費税率はどのように変化し、家計や経済にどんな影響を与えてきたか。消費者物価指数のデータとあわせて振り返る。",
    readingTime: 4,
    tags: ["消費税", "税収", "物価"],
    presetQuery: "?indicators=cpi,tax,wage&range=1989,2024&events=税制",
  },
  {
    slug: "abenomics",
    publishedAt: "2026-06-11",
    updatedAt: "2026-06-12",
    title: "アベノミクスとは何か ─ 3本の矢と経済指標の変化",
    description:
      "2012年末に始まったアベノミクスの「3本の矢」を解説。8年間で税収は43.9兆円から60.8兆円へ増加し、円安も大幅に進んだ。実質賃金への影響はどうだったか。",
    readingTime: 5,
    tags: ["アベノミクス", "金融政策", "税収"],
    presetQuery: "?indicators=wage,cpi,fx,nikkei&range=2012,2020&events=経済政策",
  },
  {
    slug: "yen-depreciation",
    publishedAt: "2026-06-11",
    updatedAt: "2026-06-12",
    title: "円安が進む仕組みと日本経済への影響",
    description:
      "2012年の1ドル=79.8円から2024年の151.8円まで、なぜ円安が進んだのか。日米金利差、日銀の金融政策との関係と、輸出企業・輸入消費者への影響を解説する。",
    readingTime: 4,
    tags: ["為替", "円安", "日銀"],
    presetQuery: "?indicators=fx,cpi,wage&range=2012,2024",
  },
  {
    slug: "lost-decades",
    publishedAt: "2026-06-11",
    updatedAt: "2026-06-12",
    title: "「失われた30年」─ 数字で見る日本経済の停滞",
    description:
      "バブル崩壊（1991年）から現在まで、日本経済の何が「失われた」のか。実質賃金・物価・税収・為替の推移をデータで俯瞰し、長期停滞の構造を読み解く。",
    readingTime: 5,
    tags: ["バブル崩壊", "デフレ", "長期停滞"],
    presetQuery: "?indicators=wage,cpi,nikkei,housing&range=1990,2024",
  },
  // ─ デ アナリシス記事
  {
    slug: "real-wages-trend-1990-2024",
    publishedAt: "2026-06-11",
    updatedAt: "2026-06-12",
    title: "日本の実質賃金推移【1990〜2024】データ分析",
    description:
      "1990年の実質賃金を100とした場合、2024年は99.2。34年間で0.8%低下した実質賃金の全像。10年ごとの変動と転機、物価との乖離を数字で追う。",
    readingTime: 6,
    tags: ["実質賃金", "データ分析", "34年推移"],
    presetQuery: "?indicators=wage,cpi&range=1990,2024",
  },
  {
    slug: "abenomics-real-wages-analysis",
    publishedAt: "2026-06-11",
    updatedAt: "2026-06-12",
    title: "アベノミクスで実質賃金は上がったのか？",
    description:
      "2012〜2020年のアベノミクス期間、実質賃金は97.4から96.5へ0.9%低下。株価・円相場・税収が上昇する中、なぜ実質賃金だけが下落したのか。8年間のデータで検証。",
    readingTime: 7,
    tags: ["アベノミクス", "実質賃金", "政策評価"],
    presetQuery: "?indicators=wage,cpi,tax,fx,nikkei&range=2012,2020",
  },
  {
    slug: "consumption-tax-wage-price",
    publishedAt: "2026-06-11",
    updatedAt: "2026-06-12",
    title: "消費税増税後の物価と賃金の変化【1997→2019】",
    description:
      "消費税の引き上げ（3→5→8→10%）で、物価はどう変わり、賃金はどう反応したのか。1997年の橋本増税・2014年の安倍増税・2019年の安倍増税（軽減税率導入）をデータで比較する。",
    readingTime: 6,
    tags: ["消費税", "物価", "賃金"],
    presetQuery: "?indicators=cpi,wage,tax&range=1989,2019&events=税制",
  },
  {
    slug: "yen-depreciation-real-wages",
    publishedAt: "2026-06-11",
    updatedAt: "2026-06-12",
    title: "円安と実質賃金の関係【2012→2024】",
    description:
      "円相場が79.8円から151.8円へ90%下落した12年間、実質賃金はどう変わったのか。円安が輸出企業を潤す一方で、家計の購買力をどう圧迫したかを数字で解く。",
    readingTime: 6,
    tags: ["円安", "実質賃金", "家計"],
    presetQuery: "?indicators=fx,wage,cpi&range=2012,2024",
  },
  {
    slug: "housing-price",
    publishedAt: "2026-06-11",
    updatedAt: "2026-06-12",
    title: "なぜ若者は家を買えないのか ─ 住宅価格と賃金の34年をデータで見る",
    description:
      "バブル崩壊で一度は下落した住宅価格は、アベノミクス以降に再上昇。一方で実質賃金は横ばいのまま。住宅価格指数と賃金・金利の動きを重ねてデータで読み解く。",
    readingTime: 5,
    tags: ["住宅価格", "不動産", "賃金"],
    presetQuery: "?indicators=housing,wage,cpi&range=1990,2024",
  },
  // ─ 新規記事
  {
    slug: "social-insurance-burden",
    publishedAt: "2026-06-11",
    updatedAt: "2026-06-12",
    title: "手取りが増えない本当の理由 ─ 社会保険料30年の増加をデータで見る",
    description:
      "給与が上がっても手取りが増えない。その原因のひとつが社会保険料の上昇だ。1990年の10.8%から2024年の18.5%へ、34年で約8ポイント増加した社会保険料負担率の実態をデータで読む。",
    readingTime: 5,
    tags: ["社会保険料", "手取り", "可処分所得"],
    presetQuery: "?indicators=wage,tax,insurance&range=1990,2024",
  },
  {
    slug: "declining-birthrate-economy",
    publishedAt: "2026-06-11",
    updatedAt: "2026-06-12",
    title: "少子化と経済の悪循環 ─ 出生数激減が家計と社会保障に与える影響",
    description:
      "1990年に121万人いた出生数は2024年に73万人台へ激減。人口減少は労働力不足を招き、社会保険料の上昇と国債残高の膨張を加速させる。少子化が経済に与える連鎖をデータで追う。",
    readingTime: 6,
    tags: ["少子化", "出生数", "社会保障"],
    presetQuery: "?indicators=births,insurance,debt&range=1990,2024",
  },
  {
    slug: "nikkei-vs-wages",
    publishedAt: "2026-06-11",
    updatedAt: "2026-06-12",
    title: "日経平均は最高値なのに、なぜ生活は豊かにならないのか",
    description:
      "2024年、日経平均は1990年比で55%以上上昇している。しかし同じ期間の実質賃金は99.2と横ばいだ。株高の恩恵はなぜ家計に届かないのか。データで構造を読み解く。",
    readingTime: 5,
    tags: ["日経平均", "株高", "格差"],
    presetQuery: "?indicators=nikkei,wage,cpi&range=1990,2024",
  },
  {
    slug: "national-debt-1000trillion",
    publishedAt: "2026-06-11",
    updatedAt: "2026-06-12",
    title: "国債残高1,000兆円超 ─ 日本の財政赤字をデータで理解する",
    description:
      "1990年に180兆円だった国債残高は2024年に1,170兆円を超えた。税収の16倍に膨らんだ借金の実態と、その背景にある財政構造を数字で確認する。",
    readingTime: 5,
    tags: ["国債", "財政赤字", "財政問題"],
    presetQuery: "?indicators=debt,tax&range=1990,2024",
  },
  {
    slug: "economic-shocks-comparison",
    publishedAt: "2026-06-11",
    updatedAt: "2026-06-12",
    title: "リーマンショックとコロナ禍 ─ 2つの経済危機が日本人の生活に与えた傷跡",
    description:
      "2008年のリーマンショックと2020年のコロナ禍。2つの危機で実質賃金・株価・為替・物価はどう動いたか。回復の速さ・深さをデータで比較する。",
    readingTime: 6,
    tags: ["リーマンショック", "コロナ禍", "経済危機"],
    presetQuery: "?indicators=wage,nikkei,fx,cpi&range=2006,2024&events=経済",
  },
  {
    slug: "fiscal-collapse-truth",
    publishedAt: "2026-06-11",
    updatedAt: "2026-06-12",
    title: "財政破綻は本当に起きるのか ─ 国債・対外純資産・投資収益からデータで考える",
    description:
      "国債残高1,170兆円は危機なのか。日本は世界最大の対外純資産国であり、海外投資からの収益（第一次所得収支）は年間35兆円超。財政破綻論の根拠と反論をデータで整理する。",
    readingTime: 8,
    tags: ["財政破綻", "国債", "対外純資産"],
    presetQuery: "?indicators=debt,tax&range=1990,2024",
  },
  // ─ SEO 強化記事（独自性重視）
  {
    slug: "money-value-time-comparison",
    publishedAt: "2026-06-11",
    updatedAt: "2026-06-12",
    title: "30年前の月収30万円は今いくら？─ 物価で換算する「お金の実質価値」",
    description:
      "1990年の30万円は2024年の何円相当か。消費者物価指数（CPI）を使って、過去の金額を現在価値に換算する方法を解説。月収・年収・貯金額を年代別に実質換算してみよう。",
    readingTime: 5,
    tags: ["物価", "インフレ", "実質価値"],
    presetQuery: "?indicators=cpi,wage&range=1990,2024",
  },
  {
    slug: "real-take-home-pay-30years",
    publishedAt: "2026-06-11",
    updatedAt: "2026-06-12",
    title: "年収500万でも、30年前の年収300万に負けている？─ 実質手取りで見る30年",
    description:
      "名目の年収が増えても、社会保険料・消費税・物価上昇で実質手取りは目減りしている。年収300万・500万・800万の3パターンで「実質手取り」を1990年と2024年で比較する。",
    readingTime: 7,
    tags: ["年収", "実質手取り", "社会保険料"],
    presetQuery: "?indicators=wage,cpi,tax,insurance&range=1990,2024",
  },
  {
    slug: "yen-purchasing-power-decline",
    publishedAt: "2026-06-11",
    updatedAt: "2026-06-12",
    title: "日本の通貨価値はどれだけ下がったか ─ ドル建てで見る30年",
    description:
      "円安と物価上昇のダブルパンチで、円の購買力は急減している。ドル建て換算した最低賃金・日経平均・GDPで日本経済を見直すと、別の風景が見えてくる。",
    readingTime: 6,
    tags: ["円安", "購買力", "ドル建て"],
    presetQuery: "?indicators=fx,cpi,wage&range=1990,2024",
  },
  {
    slug: "generation-economic-comparison",
    publishedAt: "2026-06-11",
    updatedAt: "2026-06-12",
    title: "氷河期世代 vs Z世代 ─ 経済指標で見る「生まれた時代の不公平」",
    description:
      "1973年生・1993年生・2003年生の3世代が就職時に直面した経済環境を、賃金・株価・住宅価格・社会保険料・出生数で比較。世代論を感情ではなくデータで論じる。",
    readingTime: 8,
    tags: ["世代格差", "氷河期世代", "Z世代"],
    presetQuery: "?indicators=wage,nikkei,housing,insurance,births&range=1990,2024",
  },
  {
    slug: "next-decade-forecast",
    publishedAt: "2026-06-11",
    updatedAt: "2026-06-12",
    title: "「失われた40年」になる前に ─ 2025〜2035年の日本経済を9つの指標で展望する",
    description:
      "過去30年のトレンドから今後10年の日本経済を展望。少子化・財政赤字・円安・賃上げの行方を、政府・IMF・OECDの長期見通しと過去データで照合する。",
    readingTime: 9,
    tags: ["経済予測", "長期展望", "2035年"],
    presetQuery: "?indicators=wage,cpi,debt,births&range=2000,2024",
  },
  // ─ SEO 強化記事 第2弾
  {
    slug: "average-income-trap",
    publishedAt: "2026-06-11",
    updatedAt: "2026-06-12",
    title: "「平均年収」の罠 ─ メディアが報じない統計の落とし穴",
    description:
      "「日本の平均年収は458万円」と言われるが、それを実際に稼いでいる人は意外と少ない。平均値・中央値・最頻値の違いをデータで解説し、本当の日本の所得分布を明らかにする。",
    readingTime: 6,
    tags: ["平均年収", "所得分布", "統計"],
    presetQuery: "?indicators=wage,cpi&range=1990,2024",
  },
  {
    slug: "shunto-2025-real-impact",
    publishedAt: "2026-06-11",
    updatedAt: "2026-06-12",
    title: "2025年 春闘・賃上げの実態 ─ 過去30年で最高水準だが家計に届くか",
    description:
      "2025年春闘の平均賃上げ率は5%超。33年ぶりの高水準だが、物価上昇と社会保険料増加でどれだけ手取りに反映されるのか。過去30年の賃上げ率と実質賃金の関係をデータで検証する。",
    readingTime: 6,
    tags: ["春闘", "賃上げ", "実質賃金"],
    presetQuery: "?indicators=wage,cpi,insurance&range=2010,2024",
  },
  {
    slug: "nisa-vs-savings",
    publishedAt: "2026-06-11",
    updatedAt: "2026-06-12",
    title: "新NISA vs 貯金 ─ データで考える「30年寝かせるならどっち」",
    description:
      "1990年に100万円を銀行預金とS&P500それぞれに置いた場合、2024年にいくらになっているか。日本の超低金利と米国株の長期トレンドを実データで比較し、新NISA時代の選択を考える。",
    readingTime: 7,
    tags: ["NISA", "投資", "貯金"],
    presetQuery: "?indicators=nikkei,cpi&range=1990,2024",
  },
  {
    slug: "national-debt-per-citizen",
    publishedAt: "2026-06-11",
    updatedAt: "2026-06-12",
    title: "「国民一人当たり1,000万円の借金」は本当か？─ 国債残高の正しい読み方",
    description:
      "「日本は国民一人当たり約1,000万円の借金を抱えている」というメディア報道は本当か。単純割り算の誤解、対GDP比・対金融資産比など、国債残高を正しく読み解く視点をデータで解説する。",
    readingTime: 6,
    tags: ["国債", "財政赤字", "金融資産"],
    presetQuery: "?indicators=debt,tax&range=1990,2024",
  },
  {
    slug: "inflation-cycles-japan",
    publishedAt: "2026-06-11",
    updatedAt: "2026-06-12",
    title: "物価高はいつまで続く？─ 過去30年の4つのインフレ局面を分析",
    description:
      "1990年バブル崩壊・1997年消費税増税・2008年資源高・2022年円安インフレ。日本経済が直面した4つのインフレ局面を比較し、今回の物価高の終わりを過去データから予測する。",
    readingTime: 7,
    tags: ["物価高", "インフレ", "予測"],
    presetQuery: "?indicators=cpi,fx,wage&range=1990,2024&events=経済,税制",
  },
  {
    slug: "university-cost-inflation",
    publishedAt: "2026-06-11",
    updatedAt: "2026-06-12",
    title: "大学費用30年前と今 ─ 親世代と子世代の教育費インフレ実態",
    description:
      "1990年の国立大学授業料は年34万円、2024年は53.6万円。私立大学はさらに上昇率が高い。CPI補正・賃金との対比で「教育費は本当に重くなったのか」をデータで検証する。",
    readingTime: 6,
    tags: ["教育費", "大学", "家計"],
    presetQuery: "?indicators=cpi,wage&range=1990,2024",
  },
  {
    slug: "retirement-2000man-revisited",
    publishedAt: "2026-06-11",
    updatedAt: "2026-06-12",
    title: "老後2,000万円問題は今いくら必要？─ 物価で再計算してみた",
    description:
      "2019年に話題となった「老後2,000万円問題」。報告書から5年経った2024年、物価上昇と社会保険料増加を反映すると、必要額はいくらまで膨らんでいるのか。データで再試算する。",
    readingTime: 7,
    tags: ["老後資金", "年金", "老後2000万円"],
    presetQuery: "?indicators=cpi,insurance,wage&range=2019,2024",
  },
  {
    slug: "income-inequality-japan",
    publishedAt: "2026-06-11",
    updatedAt: "2026-06-12",
    title: "格差は本当に広がっているのか？─ ジニ係数と所得分布で見る30年",
    description:
      "「日本は格差社会化している」とよく言われる。本当か。ジニ係数（当初/再分配）・相対的貧困率・所得分布の変化を30年スパンで検証し、格差の実態と政策効果をデータで解説する。",
    readingTime: 7,
    tags: ["格差", "ジニ係数", "貧困"],
    presetQuery: "?indicators=wage,tax,insurance&range=1990,2024",
  },
  {
    slug: "mortgage-rate-simulation",
    publishedAt: "2026-06-11",
    updatedAt: "2026-06-12",
    title: "日銀利上げで住宅ローンはどうなる？─ 金利推移と家計シミュレーション",
    description:
      "2024年3月、日銀はマイナス金利を解除。1990年代初頭の8%台から2022年の0.4%まで下がった住宅ローン金利は、ここから上昇に転じる可能性が高い。借入額別の月返済額シミュレーションを提示する。",
    readingTime: 7,
    tags: ["住宅ローン", "金利", "日銀"],
    presetQuery: "?indicators=housing,wage,cpi&range=1990,2024",
  },
];
