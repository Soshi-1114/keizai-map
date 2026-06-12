import Link from "next/link";
import { generateFaqPageJsonLd } from "@/lib/jsonld";

const FAQS = [
  {
    question: "KeizaiMap は何のためのサービスですか？",
    answer:
      "賃金・物価・税収・為替・日経平均・住宅価格・国債残高・出生数・社会保険料という9指標を、1990年から最新年まで1990=100の指数で揃えて重ね見できる経済データダッシュボードです。各時期の政権・経済イベントも同じ画面に重ねることで、「なぜ生活が苦しくなったのか」をデータで確認できます。",
  },
  {
    question: "データの出典はどこですか？",
    answer:
      "厚生労働省（実質賃金・出生数・社会保険料）、総務省統計局（消費者物価指数）、財務省（税収・国債残高）、日本銀行（USD/JPY為替）、国土交通省（住宅価格指数）、OECD（G7比較値）の公開統計です。e-Stat API・日銀時系列統計から自動取得している指標と、年1回手動更新の指標があります。",
  },
  {
    question: "数値はどのくらいの頻度で更新されますか？",
    answer:
      "自動指標（消費者物価・税収・為替・国債残高・出生数）は毎月1日に最新の公的統計を取得して更新します。手動指標（実質賃金・日経平均・住宅価格・社会保険料）は年1回、公的機関の年次データ確定後に更新します。最終更新日はフッターで確認できます。",
  },
  {
    question: "1990年を100とする指数化は何のためですか？",
    answer:
      "賃金（円）・物価（指数）・為替（円/ドル）など単位が異なる9指標を同じグラフで比較するため、1990年の値を全指標で100に揃えています。これにより「賃金は1990年比で-0.8%に対し、物価は+20%、税収は+125%」のように、長期の相対変化を一目で比較できます。",
  },
  {
    question: "政治的に中立ですか？",
    answer:
      "特定の政党・政権の評価を目的としません。記事では「アベノミクスの3本の矢で税収は43.9兆円から60.8兆円へ増加した」のように、評価ではなく公的統計の事実を提示します。データの集計ロジックはすべて GitHub で公開しており、誰でも検証できます。",
  },
];

export function AboutAndFAQ() {
  const faqJsonLd = generateFaqPageJsonLd(FAQS);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <section
        aria-labelledby="about-keizaimap"
        className="rounded-xl border p-5 md:p-6 space-y-4"
        style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
      >
        <h2 id="about-keizaimap" className="text-lg font-bold">
          KeizaiMap とは
        </h2>
        <div className="text-sm leading-relaxed space-y-3" style={{ color: "var(--text)" }}>
          <p>
            <strong>KeizaiMap</strong> は、日本経済の主要9指標（賃金・物価・税収・為替・日経平均・住宅価格・国債残高・出生数・社会保険料）を <strong>1990年=100の指数</strong> で揃えて重ね見できる経済データダッシュボードです。
          </p>
          <p>
            実質賃金は34年でほぼ横ばい（99.2）の一方、消費者物価は約20%上昇、税収は約2.3倍、社会保険料負担率は10.8%→18.5%へ上昇。
            「なぜ給料が上がっても生活が楽にならないのか」を、政権帯・税制改正・経済ショックと重ねて数字で確認できます。
          </p>
          <p>
            数値は厚生労働省・総務省・財務省・日本銀行・国土交通省・OECDの公開統計に基づきます。集計ロジックは
            <a
              href="https://github.com/Soshi-1114/keizai-map"
              target="_blank"
              rel="noopener noreferrer"
              className="underline mx-1"
              style={{ color: "var(--link)" }}
            >
              GitHub
            </a>
            で公開しており、変更履歴を含め誰でも検証できます。詳しくは
            <Link href="/about" className="underline mx-1" style={{ color: "var(--link)" }}>
              KeizaiMapについて
            </Link>
            を参照してください。
          </p>
        </div>
      </section>

      <section
        aria-labelledby="faq-keizaimap"
        className="rounded-xl border p-5 md:p-6 space-y-4"
        style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
      >
        <h2 id="faq-keizaimap" className="text-lg font-bold">
          よくある質問
        </h2>
        <dl className="space-y-4">
          {FAQS.map((faq) => (
            <div key={faq.question} className="space-y-1.5">
              <dt className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                Q. {faq.question}
              </dt>
              <dd className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                A. {faq.answer}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  );
}
