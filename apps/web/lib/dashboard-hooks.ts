"use client";

import { useEffect, useMemo, useRef } from "react";
import type { DataPoint, EventCategory, IndicatorKey } from "./types";
import { RAW_DATA } from "./data";
import { generateNarrative } from "./utils";
import { addRecent } from "./bookmarks";

/** 年度範囲でフィルタしたデータと自動解説を返す */
export function useFilteredData(yearRange: [number, number]): {
  filteredData: DataPoint[];
  narrative: string;
} {
  const [start, end] = yearRange;
  const filteredData = useMemo(
    () => RAW_DATA.filter(d => d.year >= start && d.year <= end),
    [start, end],
  );
  const narrative = useMemo(() => generateNarrative(filteredData), [filteredData]);
  return { filteredData, narrative };
}

/**
 * URL 同期 + 履歴自動保存。
 * URL は短デバウンス(300ms)、履歴登録は静止後 (1500ms) のみ。
 */
export function useUrlSync(
  activeIndicators: IndicatorKey[],
  yearRange: [number, number],
  activeCategories: EventCategory[],
): void {
  const urlTimer = useRef<ReturnType<typeof setTimeout>>();
  const recentTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const indicatorsStr = activeIndicators.join(",");
    const rangeStr = yearRange.join(",");
    const eventsStr = activeCategories.join(",");
    const params = new URLSearchParams({
      indicators: indicatorsStr,
      range: rangeStr,
      events: eventsStr,
    });

    clearTimeout(urlTimer.current);
    urlTimer.current = setTimeout(() => {
      window.history.replaceState(null, "", `/?${params.toString()}`);
    }, 300);

    clearTimeout(recentTimer.current);
    recentTimer.current = setTimeout(() => {
      addRecent(indicatorsStr, rangeStr, eventsStr);
    }, 1500);

    return () => {
      clearTimeout(urlTimer.current);
      clearTimeout(recentTimer.current);
    };
  }, [activeIndicators, yearRange, activeCategories]);
}
