import type { DataPoint, Administration, EconomicEvent, IndicatorConfig, IndicatorKey } from "./types";
import generatedFile from "./data.generated.json";

const { generatedAt, data: rawArray } = generatedFile as unknown as {
  generatedAt: string;
  data: DataPoint[];
};

export const RAW_DATA: DataPoint[] = rawArray;
/** フォーマット: "YYYY-MM" */
export const DATA_UPDATED_AT: string = generatedAt ?? "";

export const ADMINISTRATIONS: Administration[] = [
  { name: "海部",     start: 1989, end: 1991, party: "自民党",   color: "#3B6FD4" },
  { name: "宮澤",     start: 1991, end: 1993, party: "自民党",   color: "#3B6FD4" },
  { name: "細川",     start: 1993, end: 1994, party: "日本新党", color: "#2D9E6B" },
  { name: "羽田",     start: 1994, end: 1994, party: "新生党",   color: "#2D9E6B" },
  { name: "村山",     start: 1994, end: 1996, party: "自社さ",   color: "#A06FD4" },
  { name: "橋本",     start: 1996, end: 1998, party: "自民党",   color: "#3B6FD4" },
  { name: "小渕",     start: 1998, end: 2000, party: "自民党",   color: "#3B6FD4" },
  { name: "森",       start: 2000, end: 2001, party: "自民党",   color: "#3B6FD4" },
  { name: "小泉",     start: 2001, end: 2006, party: "自民党",   color: "#3B6FD4" },
  { name: "安倍①",   start: 2006, end: 2007, party: "自民党",   color: "#3B6FD4" },
  { name: "福田",     start: 2007, end: 2008, party: "自民党",   color: "#3B6FD4" },
  { name: "麻生",     start: 2008, end: 2009, party: "自民党",   color: "#3B6FD4" },
  { name: "鳩山",     start: 2009, end: 2010, party: "民主党",   color: "#2D9E6B" },
  { name: "菅",       start: 2010, end: 2011, party: "民主党",   color: "#2D9E6B" },
  { name: "野田",     start: 2011, end: 2012, party: "民主党",   color: "#2D9E6B" },
  { name: "安倍②",   start: 2012, end: 2020, party: "自民党",   color: "#3B6FD4" },
  { name: "菅(義偉)", start: 2020, end: 2021, party: "自民党",   color: "#3B6FD4" },
  { name: "岸田",     start: 2021, end: 2024, party: "自民党",   color: "#3B6FD4" },
  { name: "石破",     start: 2024, end: 2025, party: "自民党",   color: "#3B6FD4" },
  { name: "高市",     start: 2025, end: 2026, party: "自民党",   color: "#3B6FD4" },
];

// イベントカテゴリ色は INDICATOR_CONFIGS の各指標色とすべて衝突しない値を選定:
// - 税制: #B45309 (amber-700)   ← tax(#9333EA) と判別容易
// - 経済: #B91C1C (red-700)     ← 税収だった旧 #E05C5C と紛らわしいので深い赤へ
// - 経済政策: #047857 (emerald-700) ← fx(#4FD9A0) より暗くして指標と区別
export const EVENTS: EconomicEvent[] = [
  { year: 1991, label: "バブル崩壊",   category: "経済",     color: "#B91C1C" },
  { year: 1997, label: "消費税3→5%",   category: "税制",     color: "#B45309" },
  { year: 1998, label: "金融危機",     category: "経済",     color: "#B91C1C" },
  { year: 2008, label: "リーマン",     category: "経済",     color: "#B91C1C" },
  { year: 2011, label: "東日本大震災", category: "経済",     color: "#B91C1C" },
  { year: 2013, label: "アベノミクス", category: "経済政策", color: "#047857" },
  { year: 2014, label: "消費税5→8%",   category: "税制",     color: "#B45309" },
  { year: 2016, label: "マイナス金利", category: "経済政策", color: "#047857" },
  { year: 2019, label: "消費税8→10%",  category: "税制",     color: "#B45309" },
  { year: 2020, label: "コロナ禍",     category: "経済",     color: "#B91C1C" },
  { year: 2022, label: "円安加速",     category: "経済政策", color: "#047857" },
  { year: 2024, label: "日銀利上げ",   category: "経済政策", color: "#047857" },
  { year: 2025, label: "高市政権発足", category: "経済政策", color: "#047857" },
];

export const INDICATOR_CONFIGS: IndicatorConfig[] = [
  // color: グラフ・ダーク背景用, darkColor: 薄背景チップ等でのWCAG AA対応テキスト色
  // 全指標を 1990=100 の指数に正規化し 1 軸で表示する
  { key: "wage",      label: "実質賃金",         color: "#4F8EF7", darkColor: "#1d4ed8", unit: "（1990=100）", yAxis: "left" },
  { key: "cpi",       label: "消費者物価（CPI）", color: "#D97706", darkColor: "#92400e", unit: "（1990=100）", yAxis: "left" },
  { key: "tax",       label: "税収",             color: "#9333EA", darkColor: "#6b21a8", unit: "（兆円）",      yAxis: "left" },
  { key: "fx",        label: "USD/JPY",          color: "#4FD9A0", darkColor: "#065f46", unit: "（円）",        yAxis: "left" },
  { key: "nikkei",    label: "日経平均",          color: "#8B5CF6", darkColor: "#5b21b6", unit: "（1990=100）", yAxis: "left" },
  { key: "housing",   label: "住宅価格",          color: "#EC4899", darkColor: "#9d174d", unit: "（1990=100）", yAxis: "left" },
  { key: "debt",      label: "国債残高",          color: "#06B6D4", darkColor: "#155e75", unit: "（兆円）",      yAxis: "left" },
  { key: "births",    label: "出生数",            color: "#F59E0B", darkColor: "#78350f", unit: "（万人）",      yAxis: "left" },
  { key: "insurance", label: "社会保険料",        color: "#10B981", darkColor: "#065f46", unit: "（%）",         yAxis: "left" },
];

/** 1990 年の基準値。実数指標を 1990=100 の指数に正規化するために使用 */
export const BASELINE_1990: Record<IndicatorKey, number> = {
  wage:      100,    // 既に 1990=100 指数
  cpi:       100,    // 既に 1990=100 指数
  nikkei:    100,    // 既に 1990=100 指数
  housing:   100,    // 既に 1990=100 指数
  tax:        60.1,  // 兆円
  fx:        144.8,  // 円
  debt:      180,    // 兆円
  births:    121.1,  // 万人
  insurance:  10.8,  // %
};
