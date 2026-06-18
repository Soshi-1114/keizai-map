export type IndicatorKey = "wage" | "cpi" | "tax" | "fx" | "nikkei" | "housing" | "debt" | "births" | "insurance";
export type EventCategory = "税制" | "経済" | "経済政策";

export interface DataPoint {
  year: number;
  wage: number;
  cpi: number;
  tax: number;
  fx: number;
  nikkei?: number;
  /** 日経平均 年平均（実値、円）。MarketCard の Max レンジ用。
   *  既存の nikkei は 1990=100 リベース指数で main chart 比較用、それとは別系列。 */
  nikkeiYen?: number;
  housing?: number;
  debt?: number;
  births?: number;
  insurance?: number;
}

export interface Administration {
  name: string;
  start: number;
  end: number;
  party: string;
  color: string;
}

export interface EconomicEvent {
  year: number;
  label: string;
  category: EventCategory;
  color: string;
}

export interface IndicatorConfig {
  key: IndicatorKey;
  label: string;
  color: string;
  /** WCAG AA 対応の濃色（薄背景上での文字色に使用） */
  darkColor: string;
  unit: string;
  yAxis: "left" | "right";
}
