import { groupKey } from "@/lib/purchases/aggregate";
import type { PortfolioCurrency } from "@/lib/types/database.types";
import type { PortfolioPosition } from "@/lib/types/domain";

// Un color fijo por activo (según el orden en que se cargó), así no cambia
// cuando editás montos y el orden de la torta se reacomoda.
export const PORTFOLIO_COLORS = [
  "#2f5bff",
  "#f97316",
  "#16a36d",
  "#8b5cf6",
  "#06b6d4",
  "#ec4899",
  "#eab308",
  "#ef4444",
  "#14b8a6",
  "#64748b",
] as const;

// Precios actuales por activo (clave de `positionKey`); null si no hay cotización.
export type PositionPrices = Record<string, number | null>;

// Una posición cargada por cantidad (0,5 BTC) en lugar de por monto fijo.
export function isQuantityPosition(p: PortfolioPosition): boolean {
  return p.quantity != null && p.asset_type != null && p.symbol != null;
}

export function positionKey(p: PortfolioPosition): string {
  return groupKey({ asset_type: p.asset_type!, symbol: p.symbol! });
}

// Valor en la moneda propia del activo. Null si es por cantidad y no hay precio.
export function nativeValue(
  p: PortfolioPosition,
  prices: PositionPrices,
): number | null {
  if (!isQuantityPosition(p)) return p.amount;
  const price = prices[positionKey(p)];
  return price == null ? null : p.quantity! * price;
}

export interface PortfolioSlice {
  position: PortfolioPosition;
  color: string;
  // Valor en la moneda del activo; null si falta el precio.
  nativeValue: number | null;
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
  prices: PositionPrices = {},
): PortfolioSummary {
  const ordered = [...positions].sort((a, b) =>
    a.created_at.localeCompare(b.created_at),
  );

  const convert = (p: PortfolioPosition): number => {
    const native = nativeValue(p, prices);
    if (native === null) return 0;
    if (p.currency === displayCurrency) return native;
    if (!usdRate) return 0;
    return displayCurrency === "ARS" ? native * usdRate : native / usdRate;
  };

  const withValues = ordered.map((position, index) => ({
    position,
    color: PORTFOLIO_COLORS[index % PORTFOLIO_COLORS.length],
    nativeValue: nativeValue(position, prices),
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

export function formatQuantity(quantity: number) {
  return quantity.toLocaleString("es-AR", { maximumSignificantDigits: 6 });
}

// Línea de detalle de cada activo en la lista del portafolio.
export function describeSlice(
  slice: PortfolioSlice,
  displayCurrency: PortfolioCurrency,
): string {
  const p = slice.position;
  const converted =
    slice.nativeValue !== null && p.currency !== displayCurrency
      ? ` ≈ ${formatMoney(slice.value, displayCurrency)}`
      : "";

  if (isQuantityPosition(p)) {
    const qty = `${formatQuantity(p.quantity!)} ${p.symbol!.toUpperCase()}`;
    if (slice.nativeValue === null) return `${qty} · sin precio`;
    return `${qty} · ${formatMoney(slice.nativeValue, p.currency)}${converted}`;
  }
  return `${formatMoney(p.amount!, p.currency)}${converted}`;
}
