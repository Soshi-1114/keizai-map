import type { Metadata } from "next";
import { ArticleLayout, Section, DataBox } from "@/components/ArticleLayout";

export const metadata: Metadata = {
  title: "実質賃金とは？なぜ日本人の生活は豊かになった実感がないのか | KeizaiMap",
  description: "実質賃金とは、物価変動を考慮した賃金です。給料が10%増えても物価が20%上がれば、実際に買える商品は減ってしまいます。日本の実質賃金の推移を確認します。",
};

export default function RealWagesPage() {
  return (
    <ArticleLayout
      title="実質賃金とは？なぜ日本人の生活は豊かになった実感がないのか"
      description="実質賃金とは、物価変動を考慮した賃金です。給料が増えても物価がそれ以上に上がれば、実際の購買力は低下します。日本人の生活水準を数字で確認しましょう。"
      readingTime={3}
      tags={["賃金", "物価", "生活水準"]}
    >
      <Section heading="実質賃金とは">
        <p>
          実質賃金とは、物価変動を考慮した賃金です。
        </p>
        <p>
          例えば給料が10%増えても、物価が20%上がれば実際に買える商品やサービスは減ってしまいます。
        </p>
        <p>
          そのため経済学では、
        </p>
        <div
          className="rounded-lg border-l-4 p-4 my-4 italic"
          style={{ borderLeftColor: "#4F8EF7", backgroundColor: "var(--card)" }}
        >
          名目賃金 − 物価上昇
        </div>
        <p>
          を考慮した実質賃金が重要視されます。
        </p>
      </Section>

      <Section heading="名目賃金との違い">
        <p>
          名目賃金は給与明細に記載されている金額です。
        </p>
        <p>
          一方、実質賃金はそのお金でどれだけ物を買えるかを示します。
        </p>
        <p>
          例えば
        </p>
        <ul className="list-disc pl-5 space-y-1 my-3">
          <li>給料：100万円 → 110万円</li>
          <li>物価：100 → 120</li>
        </ul>
        <p>
          となった場合、給料は増えていますが購買力は低下しています。
        </p>
      </Section>

      <Section heading="日本の実質賃金はどう推移したのか">
        <p>
          KeizaiMapで確認すると、日本の実質賃金は1990年から2024年までほぼ横ばいとなっています。
        </p>

        <DataBox
          items={[
            { label: "1990年", value: "100.0", color: "#4F8EF7" },
            { label: "2024年", value: "99.2", color: "#ef4444" },
            { label: "物価（CPI）", value: "119.9", note: "同期間で20%上昇", color: "#D97706" },
          ]}
        />

        <p>
          同じ期間に物価や税負担が変化していることを考えると、多くの人が
          「生活が楽になった実感がない」と感じる理由の一つと考えられます。
        </p>
        <p>
          実質賃金の停滞は、単なる統計の問題ではなく、日常生活の「しんどさ」に直結しています。
          給与の数字が変わらない（あるいは少し増えた）のに、スーパーでの支出が増えているとすれば、
          それは実質賃金が下落しているサインなのです。
        </p>
      </Section>

      <Section heading="KeizaiMapで見る">
        <p>
          KeizaiMapのグラフでは、この30年間の実質賃金と物価の乖離を視覚的に確認できます。
          政権ごとの比較モードで、どの時代に実質賃金が変動したのかも分析できます。
        </p>
      </Section>

      <Section heading="まとめ">
        <p>
          実質賃金は生活水準を測る重要な指標です。
        </p>
        <p>
          景気や賃上げのニュースを見る際は、名目賃金ではなく実質賃金にも注目しましょう。
          KeizaiMapで日本経済の現実を数字で見つめることが、
          今後の経済動向を理解する第一歩となります。
        </p>
      </Section>
    </ArticleLayout>
  );
}
