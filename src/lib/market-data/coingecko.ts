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

export async function getCoinGeckoHistory(
  id: string,
  days: number | "max" = 365,
): Promise<MarketSeriesPoint[]> {
  try {
    const res = await fetch(
      `${BASE_URL}/coins/${encodeURIComponent(id)}/market_chart?vs_currency=usd&days=${days}&interval=daily`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return [];

    const data = await res.json();
    const prices: [number, number][] = data?.prices ?? [];

    return prices.map(([timestampMs, price]) => ({
      date: new Date(timestampMs).toISOString().slice(0, 10),
      close: price,
    }));
  } catch {
    return [];
  }
}
