import type { PortfolioCurrency } from "@/lib/types/database.types";
import type { PortfolioPosition } from "@/lib/types/domain";

// Un color fijo por activo (según el orden en que se cargó), así no cambia
// cuando editás montos y el orden de la torta se reacomoda.
export const PORTFOLIO_COLORS = [
  "#3b82f6",
  "#f97316",
  "#22c55e",
  "#8b5cf6",
  "#06b6d4",
  "#ec4899",
  "#eab308",
  "#ef4444",
  "#14b8a6",
  "#64748b",
] as const;

export interface PortfolioSlice {
  position: PortfolioPosition;
  color: string;
  // Valor en la moneda elegida para mostrar.
  value: number;
  // Porcentaje del total (igual en pesos o en dólares).
  percent: number;
}

export interface PortfolioSummary {
  slices: PortfolioSlice[];
  total: number;
}

// `usdRate` = pesos por dólar. Si falta, solo se pueden sumar posiciones de
// la misma moneda entre sí.
export function buildPortfolio(
  positions: PortfolioPosition[],
  displayCurrency: PortfolioCurrency,
  usdRate: number | null,
): PortfolioSummary {
  const ordered = [...positions].sort((a, b) =>
    a.created_at.localeCompare(b.created_at),
  );

  const convert = (p: PortfolioPosition): number => {
    if (p.currency === displayCurrency) return p.amount;
    if (!usdRate) return 0;
    return displayCurrency === "ARS" ? p.amount * usdRate : p.amount / usdRate;
  };

  const withValues = ordered.map((position, index) => ({
    position,
    color: PORTFOLIO_COLORS[index % PORTFOLIO_COLORS.length],
    value: convert(position),
  }));

  const total = withValues.reduce((sum, s) => sum + s.value, 0);

  const slices = withValues
    .map((s) => ({ ...s, percent: total > 0 ? (s.value / total) * 100 : 0 }))
    .sort((a, b) => b.value - a.value);

  return { slices, total };
}

export function needsUsdRate(positions: PortfolioPosition[]): boolean {
  const currencies = new Set(positions.map((p) => p.currency));
  return currencies.size > 1;
}

export function formatMoney(amount: number, currency: PortfolioCurrency) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency,
    currencyDisplay: currency === "USD" ? "code" : "symbol",
    maximumFractionDigits: amount >= 1000 ? 0 : 2,
  }).format(amount);
}

export function formatPercent(percent: number) {
  return `${percent.toLocaleString("es-AR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })}%`;
}
