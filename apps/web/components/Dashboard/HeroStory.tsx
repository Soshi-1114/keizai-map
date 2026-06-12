import type { DataPoint } from "@/lib/types";

interface Props {
  data: DataPoint[];
  yearRange: [number, number];
}

interface Highlight {
  label: string;
  /** 表示用フレーズ（"X倍" / "ほぼ横ばい" / "Xに縮小"） */
  phrase: string;
  /** trueなら強調色を「悪化」扱いに */
  bad: boolean;
}

/** 主要3指標の変化倍率を文章フレーズに変換 */
function highlightFor(
  key: "wage" | "tax" | "insurance",
  startV: number,
  endV: number,
): Highlight {
  const ratio = endV / startV;
  const label = key === "wage" ? "実質賃金" : key === "tax" ? "税収" : "社会保険料";

  // wage は「下落=悪化」、tax/insurance は「上昇=悪化（家計負担）」
  const upIsBad = key !== "wage";

  if (ratio >= 0.95 && ratio <= 1.05) {
    return { label, phrase: "ほぼ横ばい", bad: false };
  }
  if (ratio > 1.05) {
    const phrase = ratio >= 1.5 ? `${ratio.toFixed(1)}倍に` : `+${((ratio - 1) * 100).toFixed(0)}%`;
    return { label, phrase, bad: upIsBad };
  }
  // ratio < 0.95
  const phrase = `${(ratio * 100).toFixed(0)}に縮小`;
  return { label, phrase, bad: !upIsBad };
}

const BAD_COLOR = "#dc2626";   // red-600
const GOOD_COLOR = "#16a34a";  // green-600

export function HeroStory({ data, yearRange }: Props) {
  const span = yearRange[1] - yearRange[0];

  if (data.length < 2) {
    // 単年表示。横ばい等は計算できないので状況だけ提示。
    const d = data[0];
    if (!d) return null;
    return (
      <section
        className="rounded-xl border p-5 md:p-6 space-y-2"
        style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
        aria-label="ファーストビューの解説"
      >
        <p className="text-xs font-medium" style={{ color: "var(--link)" }}>
          1990年=100で見る、日本経済
        </p>
        <h2 className="text-xl md:text-2xl font-bold leading-tight">
          {d.year}年の状況 — 実質賃金 {d.wage.toFixed(1)}、物価 {d.cpi.toFixed(1)}
        </h2>
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          ↓ 下のチャートで全9指標を重ねて見られます。
        </p>
      </section>
    );
  }

  const start = data[0];
  const end = data[data.length - 1];

  const highlights: Highlight[] = [
    highlightFor("wage", start.wage, end.wage),
  ];
  if (start.tax && end.tax) {
    highlights.push(highlightFor("tax", start.tax, end.tax));
  }
  if (start.insurance != null && end.insurance != null && start.insurance > 0) {
    highlights.push(highlightFor("insurance", start.insurance, end.insurance));
  }

  return (
    <section
      className="rounded-xl border p-5 md:p-6 space-y-3"
      style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
      aria-label="ファーストビューの解説"
    >
      <p className="text-xs font-medium" style={{ color: "var(--link)" }}>
        1990年=100で見る、日本の{span}年（{start.year}→{end.year}）
      </p>
      <h2 className="text-2xl md:text-3xl font-bold leading-tight tracking-tight">
        {highlights.map((h, i) => {
          const color = h.bad ? BAD_COLOR : GOOD_COLOR;
          const isLast = i === highlights.length - 1;
          return (
            <span key={h.label}>
              {h.label}は
              <span style={{ color }} className="tabular-nums">
                {h.phrase}
              </span>
              {isLast ? "。" : "、"}
              {!isLast && " "}
            </span>
          );
        })}
      </h2>
      <p className="text-sm" style={{ color: "var(--muted)" }}>
        ↓ 下のチャートで全9指標を重ねて見られます。すべて 1990 年の値を 100 として揃えています。
      </p>
    </section>
  );
}
