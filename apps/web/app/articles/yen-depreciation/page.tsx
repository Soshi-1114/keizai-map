import type { Metadata } from "next";
import { ArticleLayout, Section, DataBox } from "@/components/ArticleLayout";

export const metadata: Metadata = {
  title: "円安が進む仕組みと日本経済への影響 | KeizaiMap",
  description: "2012年の1ドル=79.8円から2024年の151.8円まで、なぜ円安が進んだのか。日米金利差、日銀の金融政策との関係と、輸出企業・輸入消費者への影響を解説する。",
};

export default function YenDepreciationPage() {
  return (
    <ArticleLayout
      title="円安が進む仕組みと日本経済への影響"
      description="2012年に1ドル=79.8円だった円相場は、2024年には151.8円まで下落しました。なぜ円安が進んだのか、その仕組みと影響を解説します。"
      readingTime={4}
      tags={["為替", "円安", "日銀"]}
    >
      <Section heading="為替レートの基礎：なぜ円の価値は変わるのか">
        <p>
          為替レートは、2つの通貨の交換比率です。
          「1ドル=150円」とは、1ドルを入手するために150円が必要であることを意味します。
          この数字が大きくなることを<strong>円安（ドル高）</strong>、小さくなることを<strong>円高（ドル安）</strong>と呼びます。
        </p>
        <p>
          為替レートを動かす最大の要因のひとつが<strong>金利差</strong>です。
          お金は「より高い金利が得られる国の通貨」に流れる性質があります。
          日本の金利が低く、米国の金利が高ければ、ドルへの需要が高まり円安が進みます。
        </p>
      </Section>

      <Section heading="日本の為替の歩み：1990〜2024年">
        <p>
          KeizaiMapのデータは年平均の円ドルレートを示しています。
          この30年間の変動を確認しましょう。
        </p>

        <DataBox
          items={[
            { label: "1990年",      value: "144.8円", note: "バブル期", color: "#4FD9A0" },
            { label: "2012年（最高）", value: "79.8円", note: "歴史的円高", color: "#22c55e" },
            { label: "2022年",      value: "131.5円", note: "円安加速", color: "#D97706" },
            { label: "2024年",      value: "151.8円", note: "34年ぶり安値水準", color: "#ef4444" },
          ]}
        />

        <p>
          1990年代前半には輸出主導の経済成長に対する過剰な期待から円高が進み、
          1994年には一時1ドル=100円を割り込みました（年平均102.2円）。
          その後は一進一退を続け、2011年の東日本大震災後に円が歴史的な高値をつけました（2012年平均79.8円）。
        </p>
        <p>
          転機となったのが2013年以降のアベノミクスです。
          日銀による大規模な量的緩和（国債の大量購入）が円の供給量を増やし、円安を誘導しました。
          さらに2022年以降は、米国が利上げを急速に進める一方、
          日銀が超低金利政策を維持したことで日米金利差が拡大し、円安が加速しました。
        </p>
      </Section>

      <Section heading="円安の恩恵と痛み">
        <p>円安は日本経済に対して、恩恵と痛みの両面をもたらします。</p>
        <div
          className="grid md:grid-cols-2 gap-4 my-4"
          style={{ fontSize: "0.875rem" }}
        >
          <div
            className="rounded-xl border p-4"
            style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
          >
            <div className="font-medium mb-2" style={{ color: "#22c55e" }}>✓ 恩恵を受ける側</div>
            <ul className="space-y-1 text-xs" style={{ color: "var(--muted)" }}>
              <li>• 輸出企業（自動車・電機など）：海外売上を円換算すると増加</li>
              <li>• インバウンド観光業：外国人が来日しやすくなる</li>
              <li>• 海外資産を保有する投資家・企業</li>
            </ul>
          </div>
          <div
            className="rounded-xl border p-4"
            style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
          >
            <div className="font-medium mb-2" style={{ color: "#ef4444" }}>✗ 影響を受ける側</div>
            <ul className="space-y-1 text-xs" style={{ color: "var(--muted)" }}>
              <li>• 輸入に頼る食品・エネルギー価格が上昇</li>
              <li>• 実質賃金の低下（物価上昇が賃上げを上回る）</li>
              <li>• 海外旅行・留学コストの増加</li>
            </ul>
          </div>
        </div>
        <p>
          日本はエネルギーと食料の多くを輸入に依存しています。
          そのため円安は輸入コストを直撃し、消費者物価の上昇を通じて家計を圧迫します。
          2022〜2024年の物価上昇（CPI 113.1→119.9）の背景のひとつが、この円安による輸入コスト増です。
        </p>
      </Section>

      <Section heading="2024年の動向：日銀の政策転換">
        <p>
          2024年、日銀は17年ぶりとなる利上げを実施し（3月・7月）、
          長年続けてきたマイナス金利政策から転換しました。
          KeizaiMapのデータには「日銀利上げ」として2024年のイベントに記録されています。
        </p>
        <p>
          利上げによって日米金利差が縮まれば円高要因になりますが、
          2024年の年間平均レートは151.8円と依然として高い水準にあります。
          為替は金利差だけでなく、貿易収支・資本フロー・市場心理など多くの要因で動くため、
          今後の動向は予断を許しません。
        </p>
      </Section>
    </ArticleLayout>
  );
}
