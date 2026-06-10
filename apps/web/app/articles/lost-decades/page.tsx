import type { Metadata } from "next";
import { ArticleLayout, Section, DataBox } from "@/components/ArticleLayout";

export const metadata: Metadata = {
  title: "「失われた30年」─ 数字で見る日本経済の停滞 | KeizaiMap",
  description: "バブル崩壊（1991年）から現在まで、日本経済の何が「失われた」のか。実質賃金・物価・税収・為替の推移をデータで俯瞰し、長期停滞の構造を読み解く。",
};

export default function LostDecadesPage() {
  return (
    <ArticleLayout
      title="「失われた30年」─ 数字で見る日本経済の停滞"
      description="バブル崩壊から現在まで、日本経済は何を失ったのか。実質賃金・物価・税収・為替の推移をデータで俯瞰します。"
      readingTime={5}
      tags={["バブル崩壊", "デフレ", "長期停滞"]}
    >
      <Section heading="「失われた30年」とは">
        <p>
          1991年のバブル崩壊から現在まで約30年間、日本経済は他の先進国と比較して成長が停滞しています。
          この期間は「失われた20年」や「失われた30年」と呼ばれることがあります。
        </p>
        <p>
          一方、アメリカやドイツなどの主要先進国は同期間に経済を成長させ、
          生活水準を大きく向上させました。日本との差は開く一方となっています。
        </p>
        <p>
          では、データを通じて「失われたもの」が何であったかを確認しましょう。
        </p>
      </Section>

      <Section heading="実質賃金：30年で0.8%の低下">
        <p>
          1990年を基準（=100）にすると、2024年の実質賃金は99.2となっています。
          名目上は0.8%の低下ですが、この間に物価は約20%上昇しています。
        </p>
        <DataBox
          items={[
            { label: "1990年",   value: "100.0", color: "#4F8EF7" },
            { label: "2000年",   value: "107.8", note: "バブル後の一時高水準", color: "#4F8EF7" },
            { label: "2012年",   value: "97.4",  note: "リーマン後の最低点", color: "#ef4444" },
            { label: "2024年",   value: "99.2",  note: "1990年比 −0.8%", color: "#ef4444" },
          ]}
        />
        <p>
          つまり、多くの労働者の「生活の質」は実質的に低下したままの状態が続いています。
          給与の数字は若干変わったかもしれませんが、購買力は失われたままです。
        </p>
      </Section>

      <Section heading="物価：デフレからの脱却が30年かかった">
        <p>
          バブル崩壊後、日本は長期的なデフレに陥りました。
          物価上昇率がほぼゼロ、あるいはマイナスという状態が2010年代まで続きました。
        </p>
        <DataBox
          items={[
            { label: "1990年",   value: "100.0", color: "#D97706" },
            { label: "2002年",   value: "99.9",  note: "デフレの深刻化", color: "#ef4444" },
            { label: "2012年",   value: "101.5", note: "デフレ脱却へ動く", color: "#D97706" },
            { label: "2024年",   value: "119.9", note: "34年間で20%上昇", color: "#D97706" },
          ]}
        />
        <p>
          デフレは企業の設備投資や賃上げを抑制し、経済全体を沈滞させました。
          2022年以降、ようやく物価上昇へと転じましたが、その過程で家計の実質所得が圧迫されています。
        </p>
      </Section>

      <Section heading="税収：景気停滞を反映した40年間の低迷">
        <p>
          政府の一般会計税収は、バブル期の高水準からの回復を見せていません。
        </p>
        <DataBox
          items={[
            { label: "1990年",     value: "60.1兆円", color: "#22c55e" },
            { label: "2002年（最低）", value: "43.8兆円", color: "#ef4444" },
            { label: "2020年",     value: "60.8兆円", color: "#22c55e" },
            { label: "2024年",     value: "72.1兆円", color: "#22c55e" },
          ]}
        />
        <p>
          税収が回復したのは、消費税率の引き上げ（3%→5%→8%→10%）と、
          2020年以降のアベノミクスの延長による企業業績の改善によるものです。
          経済全体の「実質的な成長」ではなく、税率変更による見かけの増加という側面が強いのです。
        </p>
      </Section>

      <Section heading="為替：円の価値の変動と国際競争力">
        <p>
          円相場は30年間に大きく変動しました。
          バブル期の1990年は144.8円でしたが、2012年には79.8円まで円高が進み、
          その後は円安へと大きく転換しています。
        </p>
        <DataBox
          items={[
            { label: "1990年",   value: "144.8円", note: "バブル期の円安", color: "#4FD9A0" },
            { label: "2012年",   value: "79.8円",  note: "歴史的な円高", color: "#22c55e" },
            { label: "2020年",   value: "106.8円", note: "円安へ転換", color: "#D97706" },
            { label: "2024年",   value: "151.8円", note: "34年ぶり安値", color: "#ef4444" },
          ]}
        />
        <p>
          円高の時代（1990年代〜2010年代）は、日本の輸出企業の競争力を奪いました。
          その後の円安により輸出企業は一時的に利益を得ましたが、
          輸入品（食料・エネルギー）の価格上昇をもたらし、家計を圧迫しています。
        </p>
      </Section>

      <Section heading="何が失われたのか">
        <p>
          データから見える「失われたもの」は以下の通りです。
        </p>
        <ul className="space-y-2 my-4">
          <li>
            <strong>1. 実質所得の成長</strong>
            <br />
            <span style={{ color: "var(--muted)" }} className="text-sm">
              世界的に所得が増える中、日本の実質賃金は停滞。グローバル競争での相対的な地位低下
            </span>
          </li>
          <li>
            <strong>2. 企業の活力</strong>
            <br />
            <span style={{ color: "var(--muted)" }} className="text-sm">
              デフレで設備投資や研究開発が抑制され、技術競争力が低下
            </span>
          </li>
          <li>
            <strong>3. 人口ボーナス</strong>
            <br />
            <span style={{ color: "var(--muted)" }} className="text-sm">
              1990年代には成長の余地があった日本市場も、少子高齢化で萎縮
            </span>
          </li>
          <li>
            <strong>4. 金銭的な豊かさ</strong>
            <br />
            <span style={{ color: "var(--muted)" }} className="text-sm">
              賃金の停滞と社会保障負担の増加で、可処分所得が減少
            </span>
          </li>
        </ul>
      </Section>

      <Section heading="今後への示唆">
        <p>
          KeizaiMapのデータは、「失われた30年」が単なるスローガンではなく、
          具体的な経済指標に基づいた実態であることを示しています。
        </p>
        <p>
          これからの日本経済が、この停滞から脱出できるかどうかは、
          以下の要因にかかっています。
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>実質賃金の上昇が物価上昇を上回ること</li>
          <li>労働生産性の向上による競争力の強化</li>
          <li>デジタル化・AI産業での遅れの取り戻し</li>
          <li>人口減少の中での経済規模の維持・向上</li>
        </ul>
        <p>
          KeizaiMapで各時期のデータを比較することで、
          政策の実効性を自分たちの目で判断することができます。
        </p>
      </Section>
    </ArticleLayout>
  );
}
