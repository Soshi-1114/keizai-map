"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { IndicatorKey, EventCategory } from "@/lib/types";
import { useIsMobile } from "@/lib/hooks";
import { RAW_DATA, ADMINISTRATIONS, EVENTS, INDICATOR_CONFIGS, DATA_UPDATED_AT } from "@/lib/data";
import { Chart } from "./Chart";
import { AdminBar } from "./AdminBar";
import { RangeSlider } from "./RangeSlider";
import { EventFilter } from "./EventFilter";
import { InsightCards } from "./InsightCards";
import { ThemeToggle } from "./ThemeToggle";
import { ComparisonView } from "./ComparisonView";

const ALL_CATEGORIES: EventCategory[] = ["税制", "経済", "経済政策"];
const ALL_INDICATOR_KEYS = INDICATOR_CONFIGS.map(c => c.key);
const MIN_YEAR = 1990;
const MAX_YEAR = 2024;

// 注目の期間ショートカット（すべて隔年データに合わせた偶数年）
const ERA_SHORTCUTS: { label: string; range: [number, number] }[] = [
  { label: "バブル崩壊",    range: [1990, 1998] },
  { label: "小泉改革",      range: [2002, 2008] },
  { label: "アベノミクス",   range: [2012, 2020] },
  { label: "コロナ禍",      range: [2018, 2022] },
  { label: "円安加速",      range: [2020, 2024] },
];

function formatUpdatedAt(ym: string): string {
  const [y, m] = ym.split("-");
  if (!y || !m) return ym;
  return `${y}年${parseInt(m, 10)}月`;
}

/** 選択期間のデータをもとに自動解説文を生成 */
import type { DataPoint } from "@/lib/types";
function generateNarrative(data: DataPoint[]): string {
  if (data.length < 2) return "";
  const s = data[0];
  const e = data[data.length - 1];
  const duration = e.year - s.year;

  const pct = (end: number, start: number) => ((end - start) / start) * 100;
  const wagePct = pct(e.wage, s.wage);
  const cpiPct  = pct(e.cpi,  s.cpi);
  const taxPct  = pct(e.tax,  s.tax);
  const fxPct   = pct(e.fx,   s.fx);

  const wageStr = wagePct >  2 ? `${wagePct.toFixed(1)}%上昇`
                : wagePct < -2 ? `${Math.abs(wagePct).toFixed(1)}%下落`
                : "ほぼ横ばい";
  const cpiStr  = cpiPct >  3 ? `${cpiPct.toFixed(1)}%上昇`
                : cpiPct < -2 ? `${Math.abs(cpiPct).toFixed(1)}%低下`
                : "安定";

  const parts: string[] = [];

  if (wagePct < 0 && cpiPct > 5) {
    parts.push(
      `${duration}年間で実質賃金は${wageStr}ですが、物価は${cpiStr}しました。実質的な購買力は低下しています。`,
    );
  } else if (wagePct > 5 && cpiPct < 3) {
    parts.push(
      `${duration}年間で実質賃金は${wageStr}し、物価上昇を上回る所得増加となっています。`,
    );
  } else {
    parts.push(`${duration}年間で実質賃金は${wageStr}、物価は${cpiStr}の期間です。`);
  }

  if (Math.abs(taxPct) > 20) {
    const dir = taxPct > 0 ? "増加" : "減少";
    parts.push(
      `税収は${Math.abs(taxPct).toFixed(0)}%${dir}（${s.tax.toFixed(1)}→${e.tax.toFixed(1)}兆円）。`,
    );
  }

  if (Math.abs(fxPct) > 15) {
    const dir = fxPct > 0 ? "円安が進行" : "円高が進行";
    parts.push(
      `ドル円は${Math.abs(fxPct).toFixed(0)}%変動し${dir}（${s.fx.toFixed(0)}→${e.fx.toFixed(0)}円）。`,
    );
  }

  return parts.join("　");
}

function parseRange(param: string | null): [number, number] {
  if (!param) return [MIN_YEAR, MAX_YEAR];
  const [s, e] = param.split(",").map(Number);
  if (s >= MIN_YEAR && e <= MAX_YEAR && s < e) return [s, e];
  return [MIN_YEAR, MAX_YEAR];
}

function parseIndicators(param: string | null): IndicatorKey[] {
  if (!param) return ALL_INDICATOR_KEYS;
  const keys = param.split(",").filter(k => ALL_INDICATOR_KEYS.includes(k as IndicatorKey)) as IndicatorKey[];
  return keys.length > 0 ? keys : ALL_INDICATOR_KEYS;
}

function parseCategories(param: string | null): EventCategory[] {
  if (!param) return [...ALL_CATEGORIES];
  const cats = param.split(",").filter(c => ALL_CATEGORIES.includes(c as EventCategory)) as EventCategory[];
  return cats.length > 0 ? cats : [...ALL_CATEGORIES];
}

type ViewMode = "chart" | "admin" | "shock";

const VIEW_MODES: { key: ViewMode; label: string }[] = [
  { key: "chart", label: "グラフ" },
  { key: "admin", label: "政権比較" },
  { key: "shock", label: "ショック比較" },
];

export function MainView() {
  const isMobile = useIsMobile();
  const searchParams = useSearchParams();

  const [viewMode, setViewMode] = useState<ViewMode>("chart");
  const [yearRange, setYearRange] = useState<[number, number]>(() =>
    parseRange(searchParams.get("range"))
  );
  const [activeIndicators, setActiveIndicators] = useState<IndicatorKey[]>(() =>
    parseIndicators(searchParams.get("indicators"))
  );
  const [activeCategories, setActiveCategories] = useState<EventCategory[]>(() =>
    parseCategories(searchParams.get("events"))
  );

  const filteredData = RAW_DATA.filter(d => d.year >= yearRange[0] && d.year <= yearRange[1]);
  const narrative = generateNarrative(filteredData);

  // URL 更新（スライダー連打による SecurityError を防ぐため 300ms デバウンス）
  const urlTimer = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => {
    clearTimeout(urlTimer.current);
    urlTimer.current = setTimeout(() => {
      const params = new URLSearchParams({
        indicators: activeIndicators.join(","),
        range: yearRange.join(","),
        events: activeCategories.join(","),
      });
      window.history.replaceState(null, "", `/?${params.toString()}`);
    }, 300);
    return () => clearTimeout(urlTimer.current);
  }, [activeIndicators, yearRange, activeCategories]);

  const toggleIndicator = (key: IndicatorKey) =>
    setActiveIndicators(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );

  const toggleCategory = (cat: EventCategory) =>
    setActiveCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );

  const handleShare = () => {
    const text = `賃金・物価・税収・為替の推移を政権帯とともに確認できます。\n\n#KeizaiMap #日本経済\n${window.location.href}`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <main className="min-h-screen p-4 md:p-10" style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}>
      <div className="max-w-7xl mx-auto space-y-5">

        {/* Header */}
        <header className="flex items-end justify-between pb-4 border-b" style={{ borderColor: "var(--border)" }}>
          <div>
            <h1
              className="font-bold tracking-tight"
              style={{ fontSize: "clamp(22px, 5vw, 38px)" }}
            >
              KeizaiMap
            </h1>
            <p className="text-sm mt-0.5" style={{ color: "var(--muted)" }}>数字で見る、日本の30年</p>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/about" className="text-xs hover:underline" style={{ color: "var(--muted)" }}>
              データソースについて
            </Link>
          </div>
        </header>

        {/* Indicator toggles */}
        <div className="flex gap-2 flex-wrap">
          {INDICATOR_CONFIGS.map(cfg => {
            const active = activeIndicators.includes(cfg.key);
            return (
              <button
                key={cfg.key}
                onClick={() => toggleIndicator(cfg.key)}
                className="px-3 py-1.5 md:py-1 rounded-full text-sm border transition-all"
                style={{
                  borderColor: cfg.color,
                  color: active ? cfg.color : "var(--muted)",
                  backgroundColor: active ? cfg.color + "20" : "transparent",
                  opacity: active ? 1 : 0.45,
                }}
              >
                {cfg.label}
              </button>
            );
          })}
        </div>

        {/* ヒーロー統計バー：グラフを見る前に期間の変化を把握 */}
        {filteredData.length >= 2 && (() => {
          const s = filteredData[0];
          const e = filteredData[filteredData.length - 1];
          return (
            <div
              className="rounded-xl border px-4 py-3 flex flex-wrap items-center gap-x-5 gap-y-2"
              style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
            >
              <span className="text-xs font-semibold shrink-0" style={{ color: "var(--muted)" }}>
                {s.year}年 → {e.year}年
              </span>
              {INDICATOR_CONFIGS.map(cfg => {
                const sv = s[cfg.key] as number;
                const ev = e[cfg.key] as number;
                const pct = ((ev - sv) / sv) * 100;
                const sign = pct >= 0 ? "+" : "";
                const color = pct >= 0 ? "#22c55e" : "#ef4444";
                return (
                  <span key={cfg.key} className="flex items-baseline gap-1">
                    <span className="text-xs" style={{ color: "var(--muted)" }}>{cfg.label}</span>
                    <span className="text-sm font-bold tabular-nums" style={{ color }}>
                      {sign}{pct.toFixed(1)}%
                    </span>
                  </span>
                );
              })}
            </div>
          );
        })()}

        {/* Chart + AdminBar / 比較モード */}
        <div className="rounded-xl border p-4" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
          {/* モード切替 + シェアボタン */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <div
              className="flex gap-0.5 rounded-lg p-0.5"
              style={{ backgroundColor: "var(--bg)", border: "1px solid var(--border)" }}
            >
              {VIEW_MODES.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setViewMode(key)}
                  className="px-3 py-1 rounded-md transition-all text-xs"
                  style={{
                    backgroundColor: viewMode === key ? "var(--card)" : "transparent",
                    color:           viewMode === key ? "var(--text)" : "var(--muted)",
                    fontWeight:      viewMode === key ? 600 : 400,
                    boxShadow:       viewMode === key ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="flex-1" />
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-opacity hover:opacity-80"
              style={{ backgroundColor: "#1DA1F2", color: "#fff" }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.736-8.842L1.254 2.25H8.08l4.253 5.622 5.91-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              Xでシェア
            </button>
          </div>

          {/* コンテンツ切替 */}
          {viewMode === "chart" ? (
            <>
              <Chart
                data={filteredData}
                events={EVENTS}
                administrations={ADMINISTRATIONS}
                activeIndicators={activeIndicators}
                activeCategories={activeCategories}
              />
              <div className={isMobile ? "pl-[38px] pr-[38px]" : "pl-[55px] pr-[55px]"}>
                <AdminBar administrations={ADMINISTRATIONS} yearRange={yearRange} />
              </div>
            </>
          ) : (
            <ComparisonView mode={viewMode} activeIndicators={activeIndicators} />
          )}
        </div>

        {/* Insight cards（動的：選択期間の変化率を表示） */}
        <InsightCards data={filteredData} yearRange={yearRange} />

        {/* 自動解説：選択期間の傾向を文章で要約 */}
        {narrative && (
          <div
            className="rounded-xl border px-5 py-4"
            style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
          >
            <p className="text-xs font-medium mb-1.5" style={{ color: "#4F8EF7" }}>この期間のポイント</p>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text)" }}>{narrative}</p>
          </div>
        )}

        {/* Controls */}
        <div className="rounded-xl border p-4 space-y-5" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
          {/* 注目の期間ショートカット */}
          <div>
            <h3 className="text-xs font-medium mb-2" style={{ color: "var(--muted)" }}>注目の期間</h3>
            <div className="flex gap-2 flex-wrap">
              {ERA_SHORTCUTS.map(({ label, range }) => {
                const isActive = yearRange[0] === range[0] && yearRange[1] === range[1];
                return (
                  <button
                    key={label}
                    onClick={() => setYearRange(range)}
                    className="px-3 py-1 rounded-full text-xs border transition-all"
                    style={{
                      borderColor: isActive ? "#4F8EF7" : "var(--border)",
                      color: isActive ? "#4F8EF7" : "var(--muted)",
                      backgroundColor: isActive ? "#4F8EF720" : "transparent",
                      fontWeight: isActive ? 600 : 400,
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 表示期間スライダー */}
          <div>
            <h3 className="text-xs font-medium mb-3" style={{ color: "var(--muted)" }}>表示期間</h3>
            <RangeSlider min={MIN_YEAR} max={MAX_YEAR} value={yearRange} onChange={setYearRange} step={2} />
          </div>

          {/* イベントフィルター */}
          <div>
            <h3 className="text-xs font-medium mb-2" style={{ color: "var(--muted)" }}>経済イベントフィルター</h3>
            <EventFilter
              categories={ALL_CATEGORIES}
              activeCategories={activeCategories}
              onToggle={toggleCategory}
            />
          </div>
        </div>

        {/* Footer */}
        <footer className="text-xs text-center pt-4 border-t space-y-1" style={{ color: "var(--muted)", borderColor: "var(--border)" }}>
          <p>データ出典: 厚労省・総務省・財務省・日本銀行 &nbsp;|&nbsp; 数値はすべて公開統計に基づきます</p>
          {DATA_UPDATED_AT && (
            <p>最終更新: {formatUpdatedAt(DATA_UPDATED_AT)}</p>
          )}
        </footer>
      </div>
    </main>
  );
}
