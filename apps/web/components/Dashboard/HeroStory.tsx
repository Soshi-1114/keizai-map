"use client";

import { memo } from "react";
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

function HeroStoryImpl({ data, yearRange }: Props) {
  const span = yearRange[1] - yearRange[0];

  if (data.length < 2) {
    // 単年表示。横ばい等は計算できないので状況だけ提示。
    const d = data[0];
    if (!d) return null;
    return (
      <section
        className="rounded-xl border p-5 md:p-7 reveal reveal-2"
        style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
        aria-label="ファーストビューの解説"
      >
        <p className="eyebrow">SINGLE&nbsp;YEAR</p>
        <h2 className="font-display mt-2 leading-tight" style={{ fontSize: "clamp(20px, 4vw, 30px)" }}>
          {d.year}年の状況 — 実質賃金 <span className="font-mono">{d.wage.toFixed(1)}</span>、物価{" "}
          <span className="font-mono">{d.cpi.toFixed(1)}</span>
        </h2>
        <p className="text-xs mt-2 font-mono" style={{ color: "var(--muted)" }}>
          1990 = 100
        </p>
      </section>
    );
  }

  const start = data[0];
  const end = data[data.length - 1];

  const highlights: Highlight[] = [highlightFor("wage", start.wage, end.wage)];
  if (start.tax && end.tax) {
    highlights.push(highlightFor("tax", start.tax, end.tax));
  }
  if (start.insurance != null && end.insurance != null && start.insurance > 0) {
    highlights.push(highlightFor("insurance", start.insurance, end.insurance));
  }

  return (
    <section
      className="relative rounded-xl border overflow-hidden reveal reveal-2"
      style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
      aria-label="ファーストビューの解説"
    >
      {/* 左端に藍の太罫＝「この帳の要旨」を示す符牒 */}
      <span
        className="absolute left-0 top-0 bottom-0 w-1"
        style={{ backgroundColor: "var(--indigo)" }}
        aria-hidden
      />
      <div className="p-5 md:p-7 pl-6 md:pl-8">
        <div className="flex items-baseline justify-between gap-3 ledger-rule pb-3 mb-4">
          <p className="eyebrow">この帳の要旨</p>
          <p className="font-mono text-xs tnum" style={{ color: "var(--muted)" }}>
            {start.year}–{end.year} ／ {span}年
          </p>
        </div>

        {/* 主文：明朝で読み解きを一文に */}
        <h2
          className="font-display leading-[1.5]"
          style={{ fontSize: "clamp(19px, 3.4vw, 30px)", fontWeight: 600 }}
        >
          {highlights.map((h, i) => {
            const color = h.bad ? "var(--vermilion)" : "var(--good)";
            const isLast = i === highlights.length - 1;
            return (
              <span key={h.label}>
                <span style={{ color: "var(--muted)" }}>{h.label}は</span>
                <span style={{ color }} className="font-mono px-0.5">
                  {h.phrase}
                </span>
                <span style={{ color: "var(--muted)" }}>{isLast ? "。" : "、"}</span>
                {!isLast && " "}
              </span>
            );
          })}
        </h2>

        <p className="text-xs mt-4 font-mono" style={{ color: "var(--muted)" }}>
          基準 1990 = 100 ／ 出典: 厚労省・総務省・財務省
        </p>
      </div>
    </section>
  );
}

export const HeroStory = memo(HeroStoryImpl);
