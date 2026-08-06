export interface MarketQuote {
  price: number;
  changePercent: number;
}

export interface MarketSeriesPoint {
  date: string;
  close: number;
}

export interface AssetMarketData {
  quote: MarketQuote | null;
  series: MarketSeriesPoint[];
}

export type HistoryRange = "1M" | "6M" | "1A" | "todo";

export const HISTORY_RANGES: { value: HistoryRange; label: string }[] = [
  { value: "1M", label: "1M" },
  { value: "6M", label: "6M" },
  { value: "1A", label: "1A" },
  { value: "todo", label: "Todo" },
];
