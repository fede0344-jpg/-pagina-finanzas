import type { MarketSeriesPoint } from "./types";

export function calculatePeriodReturn(
  series: MarketSeriesPoint[],
): number | null {
  if (series.length < 2) return null;
  const first = series[0].close;
  const last = series[series.length - 1].close;
  if (!first) return null;
  return (last / first - 1) * 100;
}
