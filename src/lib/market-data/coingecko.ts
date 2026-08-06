import "server-only";
import type { MarketQuote, MarketSeriesPoint } from "./types";

const BASE_URL = "https://api.coingecko.com/api/v3";

export async function getCoinGeckoQuote(
  id: string,
): Promise<MarketQuote | null> {
  try {
    const res = await fetch(
      `${BASE_URL}/simple/price?ids=${encodeURIComponent(id)}&vs_currencies=usd&include_24hr_change=true`,
      { next: { revalidate: 60 } },
    );
    if (!res.ok) return null;

    const data = await res.json();
    const entry = data?.[id];
    if (!entry || typeof entry.usd !== "number") return null;

    return {
      price: entry.usd,
      changePercent: entry.usd_24h_change ?? 0,
    };
  } catch {
    return null;
  }
}

// El plan público de CoinGecko no deja pedir más de 365 días de historial.
const MAX_FREE_DAYS = 365;

export async function getCoinGeckoHistory(
  id: string,
  days: number = 365,
): Promise<MarketSeriesPoint[]> {
  try {
    const clampedDays = Math.min(days, MAX_FREE_DAYS);
    // Para rangos cortos dejamos que la API elija la granularidad (5min/hora),
    // así el gráfico de día/semana no queda con 1 o 2 puntos nada más.
    const useDaily = clampedDays > 90;
    const params = new URLSearchParams({
      vs_currency: "usd",
      days: String(clampedDays),
    });
    if (useDaily) params.set("interval", "daily");

    const res = await fetch(
      `${BASE_URL}/coins/${encodeURIComponent(id)}/market_chart?${params}`,
      { next: { revalidate: clampedDays <= 7 ? 120 : 3600 } },
    );
    if (!res.ok) return [];

    const data = await res.json();
    const prices: [number, number][] = data?.prices ?? [];

    return prices.map(([timestampMs, price]) => ({
      date: useDaily
        ? new Date(timestampMs).toISOString().slice(0, 10)
        : new Date(timestampMs).toISOString().slice(0, 16).replace("T", " "),
      close: price,
    }));
  } catch {
    return [];
  }
}
