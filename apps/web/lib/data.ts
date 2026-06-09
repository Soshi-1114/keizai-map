import type { DataPoint, Administration, EconomicEvent, IndicatorConfig } from "./types";

export const RAW_DATA: DataPoint[] = [
  { year: 1990, wage: 100.0, cpi: 100.0, tax: 60.1, fx: 144.8 },
  { year: 1992, wage: 107.2, cpi: 104.5, tax: 54.4, fx: 126.7 },
  { year: 1994, wage: 108.1, cpi: 106.5, tax: 51.0, fx: 102.2 },
  { year: 1996, wage: 110.3, cpi: 107.6, tax: 52.1, fx: 108.8 },
  { year: 1998, wage: 109.5, cpi: 109.5, tax: 49.4, fx: 130.9 },
  { year: 2000, wage: 107.8, cpi: 108.2, tax: 50.7, fx: 107.8 },
  { year: 2002, wage: 104.1, cpi: 107.0, tax: 43.8, fx: 125.3 },
  { year: 2004, wage: 102.9, cpi: 106.6, tax: 45.6, fx: 108.2 },
  { year: 2006, wage: 103.4, cpi: 106.6, tax: 49.1, fx: 116.3 },
  { year: 2008, wage: 102.8, cpi: 109.4, tax: 44.3, fx: 103.4 },
  { year: 2010, wage: 98.5,  cpi: 108.5, tax: 41.5, fx: 87.8  },
  { year: 2012, wage: 97.4,  cpi: 108.4, tax: 43.9, fx: 79.8  },
  { year: 2014, wage: 97.1,  cpi: 112.6, tax: 50.0, fx: 105.9 },
  { year: 2016, wage: 97.5,  cpi: 112.4, tax: 55.5, fx: 108.8 },
  { year: 2018, wage: 99.1,  cpi: 113.9, tax: 60.4, fx: 110.4 },
  { year: 2020, wage: 96.5,  cpi: 114.5, tax: 60.8, fx: 106.8 },
  { year: 2022, wage: 97.8,  cpi: 119.3, tax: 71.1, fx: 131.5 },
  { year: 2024, wage: 99.2,  cpi: 128.1, tax: 72.1, fx: 151.8 },
];

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
];

export const EVENTS: EconomicEvent[] = [
  { year: 1991, label: "バブル崩壊",   category: "経済",     color: "#E05C5C" },
  { year: 1997, label: "消費税3→5%",   category: "税制",     color: "#F7C94F" },
  { year: 1998, label: "金融危機",     category: "経済",     color: "#E05C5C" },
  { year: 2008, label: "リーマン",     category: "経済",     color: "#E05C5C" },
  { year: 2011, label: "東日本大震災", category: "経済",     color: "#E05C5C" },
  { year: 2013, label: "アベノミクス", category: "経済政策", color: "#4FD9A0" },
  { year: 2014, label: "消費税5→8%",   category: "税制",     color: "#F7C94F" },
  { year: 2016, label: "マイナス金利", category: "経済政策", color: "#4FD9A0" },
  { year: 2019, label: "消費税8→10%",  category: "税制",     color: "#F7C94F" },
  { year: 2020, label: "コロナ禍",     category: "経済",     color: "#E05C5C" },
  { year: 2022, label: "円安加速",     category: "経済政策", color: "#4FD9A0" },
  { year: 2024, label: "日銀利上げ",   category: "経済政策", color: "#4FD9A0" },
];

export const INDICATOR_CONFIGS: IndicatorConfig[] = [
  { key: "wage", label: "実質賃金",         color: "#4F8EF7", unit: "（1990=100）", yAxis: "left"  },
  { key: "cpi",  label: "消費者物価（CPI）", color: "#F7C94F", unit: "（1990=100）", yAxis: "left"  },
  { key: "tax",  label: "税収",             color: "#E05C5C", unit: "（兆円）",      yAxis: "right" },
  { key: "fx",   label: "USD/JPY",          color: "#4FD9A0", unit: "（円）",        yAxis: "right" },
];
