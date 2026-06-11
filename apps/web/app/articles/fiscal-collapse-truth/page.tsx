import type { Metadata } from "next";
import Script from "next/script";
import { ArticleLayout, Section, DataBox } from "@/components/ArticleLayout";
import { generateArticleJsonLd, generateBreadcrumbJsonLd, generateOrganizationJsonLd } from "@/lib/jsonld";

const SLUG = "fiscal-collapse-truth";

export const metadata: Metadata = {
  title: "財政破綻は本当に起きるのか ─ 国債・対外純資産・投資収益からデータで考える | KeizaiMap",
  description: "国債残高1,170兆円は危機なのか。日本は世界最大の対外純資産国であり、海外投資からの収益（第一次所得収支）は年間35兆円超。財政破綻論の根拠と反論をデータで整理する。",
};

export default function FiscalCollapseTruthPage() {
  const articleJsonLd = generateArticleJsonLd({
    title: "財政破綻は本当に起きるのか ─ 国債・対外純資産・投資収益からデータで考える",
    description: "国債残高1,170兆円は危機なのか。日本は世界最大の対外純資産国であり、海外投資からの収益は年間35兆円超。財政破綻論の根拠と反論をデータで整理する。",
    slug: SLUG,
    readingTime: 8,
    tags: ["財政破綻", "国債", "対外純資産"],
  });
  const breadcrumbJsonLd = generateBreadcrumbJsonLd(SLUG);
  const organizationJsonLd = generateOrganizationJsonLd();

  return (
    <>
      <Script id="article-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <Script id="breadcrumb-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <Script id="org-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      <ArticleLayout
        title="財政破綻は本当に起きるのか ─ 国債・対外純資産・投資収益からデータで考える"
        description="国債残高1,170兆円は危機なのか。日本は世界最大の対外純資産国であり、海外投資からの収益（第一次所得収支）は年間35兆円超。財政破綻論の根拠と反論をデータで整理する。"
        readingTime={8}
        tags={["財政破綻", "国債", "対外純資産"]}
      >
        <Section heading="「1,170兆円の借金」は本当に危機なのか">
          <p>
            「国の借金が1,000兆円を超えた」「国民一人当たり900万円超の借金」といった報道を目にしたことがある人は多いだろう。
            数字だけを見れば、日本はすでに財政危機に陥っているように感じる。
          </p>
          <p>
            しかし財政の実態は、国債残高という一面的な数字だけでは語れない。
            この記事では「財政破綻論の根拠」と「それに対する反論」をデータとともに整理し、
            読者自身が判断するための材料を提供する。
          </p>
          <div
            className="rounded-xl border-l-4 p-4 my-4 text-sm"
            style={{ borderLeftColor: "#4F8EF7", backgroundColor: "var(--card)", color: "var(--muted)" }}
          >
            ※ 本記事はいかなる政治的立場も支持・批判しません。公開統計に基づくデータの整理です。
          </div>
        </Section>

        <Section heading="財政破綻論の根拠：3つの数字">
          <DataBox
            items={[
              { label: "国債残高（2024）",     value: "1,170兆円", note: "税収の約16年分",      color: "#ef4444" },
              { label: "債務残高 / GDP比",     value: "約250%",    note: "先進国最悪水準",      color: "#ef4444" },
              { label: "社会保障費の増加傾向", value: "毎年増加",  note: "少子高齢化で加速",    color: "#D97706" },
            ]}
          />
          <p>
            国債残高のGDP比が約250%というのは、G7諸国の中で最も高い水準だ。
            IMFなどの国際機関は、長期的な財政持続可能性について繰り返し懸念を表明している。
          </p>
          <p>
            また、団塊世代が75歳以上になる「2025年問題」以降、医療・介護費の急増が予測されており、
            財政赤字の構造的な拡大が続くとみられている。
          </p>
        </Section>

        <Section heading="反論①：日本は世界最大の「対外債権国」">
          <p>
            財政破綻論への最大の反論のひとつが、「日本は世界最大の対外純資産国である」という事実だ。
          </p>
          <DataBox
            items={[
              { label: "対外純資産残高（2023）", value: "約488兆円", note: "33年連続世界1位", color: "#22c55e" },
              { label: "比較：ドイツ（2位）",    value: "約390兆円", note: "円換算概算",        color: "#4F8EF7" },
              { label: "比較：中国（3位）",      value: "約310兆円", note: "円換算概算",        color: "#4F8EF7" },
            ]}
          />
          <p>
            対外純資産とは、日本の政府・企業・個人が海外に持つ資産から、
            外国人が日本に持つ資産を差し引いた純額だ。
            日本は1991年から33年連続でこの数値が世界1位となっている。
          </p>
          <p>
            ギリシャやアルゼンチンが財政危機に陥ったのは、外国からの資金調達に依存していたためだ。
            対外純資産が豊富な日本の場合、政府が危機に陥っても、
            民間部門の対外資産を活用する余地が大きいと主張する論者もいる。
          </p>
        </Section>

        <Section heading="反論②：海外投資からの収益（第一次所得収支）が巨大">
          <p>
            日本の経常収支は近年、貿易赤字になることも増えているが、
            「第一次所得収支」と呼ばれる海外投資からの収益が経常黒字を支えている。
          </p>
          <DataBox
            items={[
              { label: "第一次所得収支（2023）",    value: "約35.9兆円", note: "過去最大水準",         color: "#22c55e" },
              { label: "貿易収支（2023）",          value: "▼約9.3兆円", note: "赤字",                 color: "#ef4444" },
              { label: "経常収支（2023）合計",      value: "約20.6兆円", note: "黒字維持",              color: "#22c55e" },
            ]}
          />
          <p>
            第一次所得収支とは、海外子会社からの配当、債券利息、直接投資収益などの合計だ。
            日本企業が長年にわたり積み上げてきた海外投資が、年間35兆円超の「不労所得」として
            日本に還流している。
          </p>
          <p>
            この規模は、国の税収（72兆円）の約50%に相当する。
            財政赤字を補填する「隠れた収益源」として機能しているとも言える。
          </p>
        </Section>

        <Section heading="反論③：国債の国内保有率が高い">
          <p>
            日本国債の約90%は国内の投資家（銀行・生保・年金・日銀など）が保有している。
          </p>
          <div
            className="rounded-xl border p-4 space-y-2 my-4"
            style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
          >
            {[
              { label: "日本銀行", value: "約53%", note: "量的緩和で大量購入" },
              { label: "銀行・生保・年金", value: "約35%", note: "国内機関投資家" },
              { label: "海外投資家", value: "約12%", note: "相対的に低い" },
            ].map(({ label, value, note }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-sm">{label}</span>
                <div className="text-right">
                  <span className="text-sm font-bold" style={{ color: "#06B6D4" }}>{value}</span>
                  <span className="text-xs ml-2" style={{ color: "var(--muted)" }}>{note}</span>
                </div>
              </div>
            ))}
          </div>
          <p>
            海外投資家への依存度が低いため、海外の格付け変更や市場動向に左右されにくい構造だ。
            ギリシャ危機では、外国人保有比率が高かったために市場の信頼喪失が連鎖した。
            日本はそのリスクが構造的に小さい、と言われる。
          </p>
        </Section>

        <Section heading="それでも残る3つのリスク">
          <p>
            上記の「反論」があるとしても、財政リスクがゼロではない点も見逃せない。
          </p>
          <div
            className="rounded-xl border p-4 space-y-3 my-4"
            style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
          >
            {[
              {
                title: "金利上昇リスク",
                desc: "日銀が金融緩和を修正して金利が上昇すると、国債の利払い費が急増する。2024年には日銀が利上げを開始しており、財政への影響が注目されている。",
                color: "#ef4444",
              },
              {
                title: "日銀の出口戦略",
                desc: "日銀が保有する国債（約580兆円）を将来的に市場に放出すれば、国債価格の下落・金利上昇をもたらす可能性がある。この「出口」がどう管理されるかは不透明だ。",
                color: "#D97706",
              },
              {
                title: "少子化による長期的な税収・経済規模の縮小",
                desc: "人口減少が続けば、経済規模（GDP）も縮小し、税収の自然増が期待できなくなる。社会保障費の増大と税収の減少が同時進行するシナリオがもっとも深刻だ。",
                color: "#D97706",
              },
            ].map(({ title, desc, color }) => (
              <div key={title} className="border-l-2 pl-3" style={{ borderColor: color }}>
                <div className="text-sm font-semibold mb-0.5" style={{ color }}>{title}</div>
                <div className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>{desc}</div>
              </div>
            ))}
          </div>
        </Section>

        <Section heading="結論：「即座の破綻」は考えにくいが、構造問題は深刻">
          <p>
            現時点のデータが示す日本の財政状況をまとめると、以下の通りだ。
          </p>
          <div
            className="rounded-xl border p-4 space-y-2 my-4"
            style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
          >
            <div className="text-xs font-semibold mb-2" style={{ color: "var(--muted)" }}>破綻しにくい要因</div>
            {["世界最大の対外純資産（488兆円）", "第一次所得収支の黒字（年35兆円超）", "国債の国内保有率の高さ（約90%）", "円建て国債のため自国通貨での返済が可能"].map(item => (
              <div key={item} className="flex items-center gap-2 text-xs" style={{ color: "var(--text)" }}>
                <span style={{ color: "#22c55e" }}>✓</span>{item}
              </div>
            ))}
            <div className="text-xs font-semibold mb-2 mt-3" style={{ color: "var(--muted)" }}>リスク要因</div>
            {["国債残高のGDP比250%（先進国最悪）", "少子高齢化による社会保障費の増大", "金利上昇による利払い費急増リスク", "人口減少による長期的な税収・経済縮小"].map(item => (
              <div key={item} className="flex items-center gap-2 text-xs" style={{ color: "var(--text)" }}>
                <span style={{ color: "#ef4444" }}>!</span>{item}
              </div>
            ))}
          </div>
          <p>
            「財政破綻が明日起きる」という主張も、「まったく心配ない」という主張も、
            どちらもデータの一部だけを切り取ったものと言える。
          </p>
          <p>
            重要なのは、これらの数字を継続的に観察し、変化の兆候を自分で読み取ることだ。
            KeizaiMapでは国債残高・税収の推移を確認できる。
            そして第一次所得収支や対外純資産は財務省・日銀の公開統計で確認できる。
            データを自分の目で見て、判断する習慣をつけてほしい。
          </p>
        </Section>
      </ArticleLayout>
    </>
  );
}
