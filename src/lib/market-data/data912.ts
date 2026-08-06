import "server-only";
import type { MarketQuote, MarketSeriesPoint } from "./types";

const BASE_URL = "https://data912.com";

export type Data912AssetType = "cedear" | "accion_arg" | "bono_arg";

const LIVE_PATHS: Record<Data912AssetType, string> = {
  cedear: "arg_cedears",
  accion_arg: "arg_stocks",
  bono_arg: "arg_bonds",
};

const HISTORY_PATHS: Record<Data912AssetType, string> = {
  cedear: "cedears",
  accion_arg: "stocks",
  bono_arg: "bonds",
};

interface LiveEntry {
  symbol: string;
  c: number;
  pct_change: number;
}

interface HistoryEntry {
  date: string;
  c: number;
}

export async function getData912Quote(
  assetType: Data912AssetType,
  symbol: string,
): Promise<MarketQuote | null> {
  try {
    const res = await fetch(`${BASE_URL}/live/${LIVE_PATHS[assetType]}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;

    const data: LiveEntry[] = await res.json();
    const entry = data.find(
      (row) => row.symbol.toUpperCase() === symbol.toUpperCase(),
    );
    if (!entry) return null;

    return { price: entry.c, changePercent: entry.pct_change ?? 0 };
  } catch {
    return null;
  }
}

export async function getData912History(
  assetType: Data912AssetType,
  symbol: string,
  days: number | "all" = 365,
): Promise<MarketSeriesPoint[]> {
  try {
    const res = await fetch(
      `${BASE_URL}/historical/${HISTORY_PATHS[assetType]}/${encodeURIComponent(symbol.toUpperCase())}`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return [];

    const data: HistoryEntry[] = await res.json();
    // No hay datos intradía acá (solo cierres diarios), así que para
    // rangos muy cortos (día/semana) igual mostramos algunas ruedas más
    // para que el gráfico no quede vacío o con un solo punto.
    const minPoints = 5;
    const sliced =
      days === "all" ? data : data.slice(-Math.max(days, minPoints));
    return sliced.map((row) => ({ date: row.date, close: row.c }));
  } catch {
    return [];
  }
}
