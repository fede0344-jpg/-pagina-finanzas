"use server";

import { getTickerItems } from "@/lib/market-data/ticker";
import type { TickerItem } from "@/lib/market-data/ticker";

export async function refreshTicker(): Promise<TickerItem[]> {
  return getTickerItems();
}
