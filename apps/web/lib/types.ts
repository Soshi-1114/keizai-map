export type IndicatorKey = "wage" | "cpi" | "tax" | "fx" | "nikkei" | "housing" | "debt" | "births" | "insurance";
export type EventCategory = "税制" | "経済" | "経済政策";

export interface DataPoint {
  year: number;
  wage: number;
  cpi: number;
  tax: number;
  fx: number;
  nikkei?: number;
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
