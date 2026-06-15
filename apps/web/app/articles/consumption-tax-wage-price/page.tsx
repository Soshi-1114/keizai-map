import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout, Section, DataBox } from "@/components/ArticleLayout";
import { articleOpenGraph, articleSeoTitle } from "@/lib/article-metadata";
import { generateArticleJsonLd, generateBreadcrumbJsonLd, generateOrganizationJsonLd, generateFaqPageJsonLd } from "@/lib/jsonld";

const SLUG = "consumption-tax-wage-price";

export const metadata: Metadata = {
  alternates: { canonical: "/articles/consumption-tax-wage-price" },
  title: articleSeoTitle(SLUG),
  description: "消費税の4回の引き上げ（3→5→8→10%）で、物価はどう変わり、賃金はどう反応したのか。1997年の橋本増税と2019年の岸田増税を比較分析。",
  openGraph: articleOpenGraph("consumption-tax-wage-price"),
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
  const faqJsonLd = generateFaqPageJsonLd([
    {
      question: "日本では消費税は何回引き上げられましたか？",
      answer: "1989年から2019年の30年間で4度の消費税改定が行われました。1989年に3%で導入、1997年に5%、2014年に8%、2019年に10%へと段階的に引き上げられ、2019年には食料品等を対象とする軽減税率（8%据置）も初めて導入されました。",
    },
    {
      question: "1997年の消費税増税はどのような影響をもたらしましたか？",
      answer: "1997年の3→5%増税は橋本龍太郎政権下で実施されました。物価は1997年に1.9ポイント上昇し、その後アジア通貨危機と金融機関破綻が相次ぎました。実質賃金は1998年から本格的に下降に転じ、「失われた20年」の入り口になったと指摘されています。",
    },
    {
      question: "2014年の消費税増税で物価はどれだけ上がりましたか？",
      answer: "2014年の5→8%増税で物価指数は2012年比3.6ポイント上昇しました。これは1997年の橋本増税年（+1.9pt）を上回る上昇幅で、実質賃金は97.4から97.1へ低下しました。アベノミクスの円安による輸入物価上昇とも重なりました。",
    },
    {
      question: "消費税収はどのように使われていますか？",
      answer: "消費税収は年金・医療・介護・少子化対策などの社会保障財源への充当が法律で定められています。財務省資料によると、ほぼ全額が社会保障関連経費に充てられていますが、社会保障費全体の増加額に対しては部分的な充当にとどまるとされています。",
    },
  ]);

  return (
    <>
      <script
        id="article-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        id="breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        id="org-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        id="faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <ArticleLayout
        slug={SLUG}
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
            { label: "1996年", value: "107.1", note: "5%増税前", color: "#D97706" },
            { label: "1997年", value: "109.0", note: "増税実施年（+1.9pt）", color: "#D97706" },
            { label: "1998年", value: "109.7", note: "金融危機で一層上昇（+0.7pt）", color: "#ef4444" },
          ]}
        />
        <DataBox
          items={[
            { label: "1996年", value: "110.3", note: "実質賃金（増税前）", color: "#4F8EF7" },
            { label: "1997年", value: "110.7", note: "実質賃金（増税年）", color: "#4F8EF7" },
            { label: "1998年", value: "109.5", note: "増税2年目で低下", color: "#ef4444" },
          ]}
        />
        <p>
          橋本龍太郎首相が実行した1997年の3→5%増税は、
          その直後に「アジア通貨危機」と日本の「金融機関破綻」が相次ぎました。
        </p>
        <p>
          物価は1997年に1.9ポイント上昇し、
          その翌年の金融危機を経て1998年にはさらに0.7ポイント上昇しました。
          実質賃金は1998年から本格的に下降に転じ、その後も回復しませんでした。
        </p>
        <p>
          この増税は「失われた20年」の入り口となったと指摘する経済学者もいます。
        </p>
      </Section>

      <Section heading="2014年：安倍政権の5→8%増税">
        <DataBox
          items={[
            { label: "2012年", value: "105.6", note: "8%増税前", color: "#D97706" },
            { label: "2013年", value: "105.9", note: "アベノミクス開始年", color: "#D97706" },
            { label: "2014年", value: "109.2", note: "増税年（2012年比+3.6pt）", color: "#ef4444" },
          ]}
        />
        <DataBox
          items={[
            { label: "2012年", value: "97.4", note: "実質賃金（増税前）", color: "#4F8EF7" },
            { label: "2014年", value: "97.1", note: "実質賃金（増税後）▼0.3%", color: "#ef4444" },
          ]}
        />
        <p>
          2014年の消費税3%引き上げ（5→8%）は、2012年比で物価を3.6ポイント上昇させました。
          これは1997年の橋本増税年（+1.9pt）を上回る上昇幅です。
        </p>
        <p>
          同時期、アベノミクスの「円安」により輸入物価も上昇していました。
          結果として、実質賃金は97.4から97.1へ低下しました。
          政府は「景気対策」として10%への引き上げを延期すると表明し、その後2年間据え置きされました。
        </p>
      </Section>

      <Section heading="2019年：安倍政権の8→10%増税と「軽減税率」">
        <DataBox
          items={[
            { label: "2018年", value: "111.8", note: "10%増税前", color: "#D97706" },
            { label: "2019年", value: "112.4", note: "増税年（+0.6pt）", color: "#D97706" },
            { label: "2020年", value: "112.4", note: "コロナ禍で横ばい", color: "#D97706" },
          ]}
        />
        <DataBox
          items={[
            { label: "2018年", value: "99.1", note: "実質賃金（増税前）", color: "#4F8EF7" },
            { label: "2019年", value: "98.7", note: "実質賃金（増税後）▼0.4%", color: "#ef4444" },
            { label: "2020年", value: "96.5", note: "COVID-19で一層低下", color: "#ef4444" },
          ]}
        />
        <p>
          2019年の消費税2%引き上げ（8→10%）は安倍政権下で実施され、
          初めて「軽減税率」が導入されました。
          食料品やケータリング、新聞などは8%で据え置きするという政策です。
        </p>
        <p>
          軽減税率の影響もあり、物価上昇は2019年に0.6ポイントにとどまりましたが、
          実質賃金は0.4%低下しました。
          その直後のCOVID-19パンデミックで実質賃金はさらに低下しました。
        </p>
      </Section>

      <Section heading="3度の増税の共通点：物価上昇 > 賃上げ">
        <DataBox
          items={[
            { label: "1997年（3→5%）",  value: "+1.9pt", note: "実質賃金 翌年▼1.1%", color: "#ef4444" },
            { label: "2014年（5→8%）",  value: "+3.3pt", note: "実質賃金 ▼0.3%（2013→2014）", color: "#ef4444" },
            { label: "2019年（8→10%）", value: "+0.6pt", note: "実質賃金 ▼0.4%", color: "#ef4444" },
          ]}
        />
        <p>
          3度の増税すべてに共通するパターンがあります。
        </p>
        <ul className="list-disc pl-5 space-y-1 my-3">
          <li><strong>物価は増税前後で上昇</strong> ─ 増税幅と概ね比例した形でCPIが押し上げられる</li>
          <li><strong>賃上げは物価上昇に追い付かない</strong> ─ 名目賃金の伸びが物価に届かず実質賃金は減少傾向</li>
          <li><strong>実質賃金は低下方向</strong> ─ いずれの増税局面でも同じパターンが見られる</li>
          <li><strong>低所得層への影響が相対的に大きい</strong> ─ 消費税は逆進性が指摘される間接税</li>
        </ul>
      </Section>

      <Section heading="「社会保障財源」としての消費税">
        <p>
          消費税は、増税分の使途として社会保障財源（年金・医療・介護・少子化対策）への充当が
          法律で定められています。財務省の資料によると、消費税収はほぼ全額が社会保障関連経費に
          充てられていますが、社会保障費全体の増加額に対しては部分的な充当にとどまるとされています。
        </p>
        <p>
          一方で、医療費の自己負担割合の見直し・年金支給開始年齢の段階的引き上げなど、
          給付側でも見直しが進められており、家計負担の総額は増加傾向にあります。
        </p>
      </Section>

      <Section heading="KeizaiMapで検証：物価と賃金の乖離を見る">
        <p>
          KeizaiMap のグラフで「実質賃金」と「消費者物価（CPI）」を同時表示し、
          1997年、2014年、2019年の増税時点でズームして観察してください。
        </p>
        <p>
          いずれの増税局面でも、物価指数が上昇に転じる一方で、実質賃金は下降する場面が確認できます。
        </p>
      </Section>

      <Section heading="まとめ：3度の増税で見えるパターン">
        <ul className="list-disc pl-5 space-y-1">
          <li>3度の消費税増税すべてで、物価上昇が賃上げを上回る傾向が見られた</li>
          <li>1997年の橋本増税は日本の長期停滞の転機の一つとされる</li>
          <li>2014年の安倍増税は3%引き上げで2012年比3.6ポイントの物価上昇をもたらした</li>
          <li>2019年の安倍増税では軽減税率が導入されたものの、実質賃金は低下した</li>
          <li>消費税収は社会保障財源として法定されており、増収分は社会保障経費に充当されている</li>
        </ul>
      </Section>
      <Section heading="関連記事">
        <ul className="list-disc pl-5 space-y-1">
          <li><Link href="/articles/consumption-tax" className="underline" style={{ color: "var(--link)" }}>消費税率引き上げの歴史と家計への影響</Link></li>
          <li><Link href="/articles/real-wages" className="underline" style={{ color: "var(--link)" }}>実質賃金とは？なぜ日本人の生活は豊かになった実感がないのか</Link></li>
          <li><Link href="/articles/social-insurance-burden" className="underline" style={{ color: "var(--link)" }}>手取りが増えない本当の理由 ─ 社会保険料30年の増加</Link></li>
        </ul>
      </Section>
    </ArticleLayout>
    </>
  );
}
