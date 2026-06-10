"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import type { IndicatorKey, EventCategory } from "@/lib/types";
import { useIsMobile } from "@/lib/hooks";
import { RAW_DATA, ADMINISTRATIONS, EVENTS, INDICATOR_CONFIGS } from "@/lib/data";
import { Chart } from "./Chart";
import { AdminBar } from "./AdminBar";
import { RangeSlider } from "./RangeSlider";
import { EventFilter } from "./EventFilter";
import { InsightCards } from "./InsightCards";
import { ThemeToggle } from "./ThemeToggle";

const ALL_CATEGORIES: EventCategory[] = ["税制", "経済", "経済政策"];
const ALL_INDICATOR_KEYS = INDICATOR_CONFIGS.map(c => c.key);
const MIN_YEAR = 1990;
const MAX_YEAR = 2024;

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

export function MainView() {
  const isMobile = useIsMobile();
  const searchParams = useSearchParams();
  const router = useRouter();

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

  // Sync URL whenever state changes
  const updateURL = useCallback((
    indicators: IndicatorKey[],
    range: [number, number],
    events: EventCategory[]
  ) => {
    const params = new URLSearchParams({
      indicators: indicators.join(","),
      range: range.join(","),
      events: events.join(","),
    });
    router.replace(`/?${params.toString()}`, { scroll: false });
  }, [router]);

  useEffect(() => {
    updateURL(activeIndicators, yearRange, activeCategories);
  }, [activeIndicators, yearRange, activeCategories, updateURL]);

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

        {/* Chart + AdminBar */}
        <div className="rounded-xl border p-4" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
          {/* Chart header with share button */}
          <div className="flex items-center justify-end mb-2">
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

          <Chart
            data={filteredData}
            events={EVENTS}
            administrations={ADMINISTRATIONS}
            activeIndicators={activeIndicators}
            activeCategories={activeCategories}
          />
          {/* AdminBar: pl/pr matches YAxis width */}
          <div className={isMobile ? "pl-[38px] pr-[38px]" : "pl-[55px] pr-[55px]"}>
            <AdminBar administrations={ADMINISTRATIONS} yearRange={yearRange} />
          </div>
        </div>

        {/* Insight cards */}
        <InsightCards />

        {/* Controls */}
        <div className="rounded-xl border p-4 space-y-5" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
          <div>
            <h3 className="text-xs font-medium mb-3" style={{ color: "var(--muted)" }}>表示期間</h3>
            <RangeSlider min={MIN_YEAR} max={MAX_YEAR} value={yearRange} onChange={setYearRange} step={2} />
          </div>
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
        <footer className="text-xs text-center pt-4 border-t" style={{ color: "var(--muted)", borderColor: "var(--border)" }}>
          データ出典: 厚労省・総務省・財務省・日本銀行 &nbsp;|&nbsp; 数値はすべて公開統計に基づきます
        </footer>
      </div>
    </main>
  );
}
