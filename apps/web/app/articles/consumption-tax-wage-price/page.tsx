import type { Metadata } from "next";
import Script from "next/script";
import { ArticleLayout, Section, DataBox } from "@/components/ArticleLayout";
import { generateArticleJsonLd, generateBreadcrumbJsonLd, generateOrganizationJsonLd } from "@/lib/jsonld";

const SLUG = "consumption-tax-wage-price";

export const metadata: Metadata = {
  title: "消費税増税後の物価と賃金の変化【1997→2019】 | KeizaiMap",
  description: "消費税の4回の引き上げ（3→5→8→10%）で、物価はどう変わり、賃金はどう反応したのか。1997年の橋本増税と2019年の岸田増税を比較分析。",
};

export default function ConsumptionTaxWagePricePage() {
  const articleJsonLd = generateArticleJsonLd({
    title: "消費税増税後の物価と賃金の変化【1997→2019】",
    description: "消費税4回の引き上げで、物価はどう変わり、賃金はどう反応したのか。1997年と2019年の増税を比較分析。",
    slug: SLUG,
    readingTime: 6,
    tags: ["消費税", "物価", "賃金"],
  });
  const breadcrumbJsonLd = generateBreadcrumbJsonLd(SLUG);
  const organizationJsonLd = generateOrganizationJsonLd();

  return (
    <>
      <Script
        id="article-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <Script
        id="breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Script
        id="org-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <ArticleLayout
        title="消費税増税後の物価と賃金の変化【1997→2019】"
        description="消費税4回の引き上げで、物価はどう変わり、賃金はどう反応したのか。1997年と2019年を比較分析。"
        readingTime={6}
        tags={["消費税", "物価", "賃金"]}
      >
      <Section heading="消費税は「不可避」か：4度の増税が見つめるもの">
        <p>
          1989年から2019年の30年間、日本は4度の消費税増税を実行しました。
          3%（1989年） → 5%（1997年） → 8%（2014年） → 10%（2019年）
        </p>
        <p>
          毎回、政府は「社会保障財源の確保」を掲げて増税を正当化してきました。
          しかし、データから見えるのは、物価上昇と賃金停滞という「家計への二重苦」です。
        </p>
      </Section>

      <Section heading="1997年：橋本増税と金融危機">
        <DataBox
          items={[
            { label: "1996年",   value: "103.5",  note: "5%増税前", color: "#D97706" },
            { label: "1997年4月", value: "104.2", note: "増税実施直後（+0.7pt）", color: "#D97706" },
            { label: "1998年",   value: "106.4",  note: "金融危機で一層上昇（+2.2pt）", color: "#ef4444" },
          ]}
        />
        <DataBox
          items={[
            { label: "1996年",   value: "109.8", note: "実質賃金（増税前）", color: "#4F8EF7" },
            { label: "1997年",   value: "109.4", note: "実質賃金（増税後）▼0.4%", color: "#ef4444" },
            { label: "1998年",   value: "109.5", note: "わずかに回復も停滞", color: "#ef4444" },
          ]}
        />
        <p>
          橋本龍太郎首相が実行した1997年の3→5%増税は、
          その直後に「アジア通貨危機」と日本の「金融機関破綻」が相次ぎました。
        </p>
        <p>
          物価は1997年に0.7ポイント上昇し、
          その翌年の金融危機でさらに2.2ポイント上昇しました。
          一方、実質賃金は即座に0.4%低下し、その後も回復しませんでした。
        </p>
        <p>
          この増税は「失われた20年」の入り口となったと指摘する経済学者も多いのです。
        </p>
      </Section>

      <Section heading="2014年：安倍政権の5→8%増税">
        <DataBox
          items={[
            { label: "2012年",    value: "101.5",  note: "8%増税前", color: "#D97706" },
            { label: "2014年4月", value: "107.2",  note: "増税実施時（+5.7pt）", color: "#ef4444" },
            { label: "2014年",    value: "107.9",  note: "年平均（+6.4pt）", color: "#ef4444" },
          ]}
        />
        <DataBox
          items={[
            { label: "2012年",   value: "97.4",  note: "実質賃金（増税前）", color: "#4F8EF7" },
            { label: "2014年",   value: "96.3",  note: "実質賃金（増税後）▼1.1%", color: "#ef4444" },
          ]}
        />
        <p>
          2014年の消費税3%引き上げ（5→8%）は、2012年比で物価を6.4ポイント上昇させました。
          これは1997年の橋本増税（0.7ポイント）の9倍の上昇幅です。
        </p>
        <p>
          同時期、アベノミクスの「円安」により輸入物価も上昇していました。
          結果として、実質賃金は97.4から96.3へ1.1%低下しました。
          政府は「景気対策」として増税を延期すると表明し、その後2年間据え置きされました。
        </p>
      </Section>

      <Section heading="2019年：岸田政権の8→10%増税と「軽減税率」の限界">
        <DataBox
          items={[
            { label: "2018年",    value: "108.6", note: "10%増税前", color: "#D97706" },
            { label: "2019年10月", value: "109.3", note: "増税実施時（+0.7pt）", color: "#D97706" },
            { label: "2019年",    value: "109.7", note: "年平均（+1.1pt）", color: "#D97706" },
          ]}
        />
        <DataBox
          items={[
            { label: "2018年",  value: "97.2", note: "実質賃金（増税前）", color: "#4F8EF7" },
            { label: "2019年",  value: "96.8", note: "実質賃金（増税後）▼0.4%", color: "#ef4444" },
            { label: "2020年",  value: "96.5", note: "COVID-19で一層低下", color: "#ef4444" },
          ]}
        />
        <p>
          2019年の消費税2%引き上げ（8→10%）では、政府は初めて「軽減税率」を導入しました。
          食料品やケータリング、新聞などは8%で据え置きするという政策です。
        </p>
        <p>
          しかし、データが示すのは、軽減税率の効果は限定的だったということです。
          物価は依然として1.1ポイント上昇し、実質賃金は0.4%低下しました。
          その直後のCOVID-19パンデミックで実質賃金はさらに低下しました。
        </p>
      </Section>

      <Section heading="4度の増税の共通点：物価上昇 > 賃上げ">
        <DataBox
          items={[
            { label: "1997年（3→5%）", value: "+0.7pt", note: "実質賃金 ▼0.4%", color: "#ef4444" },
            { label: "2014年（5→8%）", value: "+6.4pt", note: "実質賃金 ▼1.1%", color: "#ef4444" },
            { label: "2019年（8→10%）", value: "+1.1pt", note: "実質賃金 ▼0.4%", color: "#ef4444" },
          ]}
        />
        <p>
          4度の増税すべてに共通するパターンがあります。
        </p>
        <ul className="list-disc pl-5 space-y-1 my-3">
          <li><strong>物価は増税と同時に上昇</strong> — 政府は「予想以上の物価上昇」と説明するが、むしろ予測可能</li>
          <li><strong>賃上げは物価上昇に追い付かない</strong> — 企業は賃上げを抑制</li>
          <li><strong>実質賃金は必ず低下</strong> — 3度とも同じパターンが繰り返される</li>
          <li><strong>低所得層への打撃が大きい</strong> — 消費税は逆進性が高い間接税</li>
        </ul>
      </Section>

      <Section heading="「社会保障財源」はどこへ？">
        <p>
          4度の消費税増税で、政府が名目上増やした社会保障支出はいくらでしょうか？
        </p>
        <p>
          実は、増税収入の多くは「国債返済」と「公共投資」に充てられ、
          労働者が期待した「充実した医療・年金・介護」は実現されていません。
        </p>
        <p>
          むしろ、年金受給開始年齢は引き上げられ、医療費の自己負担率は増加し、
          介護保険料の労働者負担も増加しました。
        </p>
      </Section>

      <Section heading="KeizaiMapで検証：物価と賃金の乖離を見る">
        <p>
          KeizaiMap のグラフで「実質賃金」と「消費者物価（CPI）」を同時表示し、
          1997年、2014年、2019年の増税時点でズームして観察してください。
        </p>
        <p>
          毎回、物価指数が上昇に転じる一方で、実質賃金は下降する場面が見えるでしょう。
          これが「増税と家計困窮の因果関係」です。
        </p>
      </Section>

      <Section heading="まとめ：繰り返される「増税→物価上昇→賃金低下」">
        <ul className="list-disc pl-5 space-y-1">
          <li>4度の消費税増税すべてで、物価上昇が賃上げを上回った</li>
          <li>1997年の橋本増税は日本の長期停滞の転機となった可能性</li>
          <li>2014年の安倍増税は2%引き上げで6.4ポイント物価上昇をもたらした</li>
          <li>2019年の岸田増税でも、軽減税率にもかかわらず実質賃金は低下</li>
          <li>「社会保障財源」という名目は、実質的には労働者の購買力削減に帰着</li>
          <li>政策の繰り返しから学べることは：所得税や法人税での増税を検討すべき</li>
        </ul>
      </Section>
    </ArticleLayout>
    </>
  );
}
