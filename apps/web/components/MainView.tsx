"use client";

import { useState } from "react";
import Link from "next/link";
import type { IndicatorKey, EventCategory } from "@/lib/types";
import { useIsMobile } from "@/lib/hooks";
import { RAW_DATA, ADMINISTRATIONS, EVENTS, INDICATOR_CONFIGS } from "@/lib/data";
import { Chart } from "./Chart";
import { AdminBar } from "./AdminBar";
import { RangeSlider } from "./RangeSlider";
import { EventFilter } from "./EventFilter";
import { InsightCards } from "./InsightCards";

const ALL_CATEGORIES: EventCategory[] = ["税制", "経済", "経済政策"];
const MIN_YEAR = 1990;
const MAX_YEAR = 2024;

export function MainView() {
  const isMobile = useIsMobile();
  const [yearRange, setYearRange] = useState<[number, number]>([MIN_YEAR, MAX_YEAR]);
  const [activeIndicators, setActiveIndicators] = useState<IndicatorKey[]>(
    INDICATOR_CONFIGS.map(c => c.key)
  );
  const [activeCategories, setActiveCategories] = useState<EventCategory[]>([...ALL_CATEGORIES]);

  const filteredData = RAW_DATA.filter(d => d.year >= yearRange[0] && d.year <= yearRange[1]);

  const toggleIndicator = (key: IndicatorKey) =>
    setActiveIndicators(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );

  const toggleCategory = (cat: EventCategory) =>
    setActiveCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );

  return (
    <main className="min-h-screen p-4 md:p-10" style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}>
      <div className="max-w-7xl mx-auto space-y-5">

        {/* Header */}
        <header className="flex items-end justify-between pb-4 border-b" style={{ borderColor: "var(--border)" }}>
          <div>
            <h1 className="font-bold tracking-tight" style={{ fontSize: "clamp(22px, 5vw, 38px)" }}>KeizaiMap</h1>
            <p className="text-sm mt-0.5" style={{ color: "var(--muted)" }}>数字で見る、日本の30年</p>
          </div>
          <Link href="/about" className="text-xs hover:underline" style={{ color: "var(--muted)" }}>
            データソースについて
          </Link>
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
