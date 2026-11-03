import type { Purchase } from "@/lib/types/domain";

export type PurchaseCurrency = "USD" | "ARS";

export function purchaseCurrency(assetType: Purchase["asset_type"]) {
  return assetType === "crypto" ? "USD" : "ARS";
}

export interface PurchaseRow {
  purchase: Purchase;
  currentValue: number | null;
  gain: number | null;
  gainPercent: number | null;
}

export interface AssetGroup {
  key: string;
  name: string;
  symbol: string;
  assetType: Purchase["asset_type"];
  currency: PurchaseCurrency;
  price: number | null;
  invested: number;
  currentValue: number | null;
  gain: number | null;
  gainPercent: number | null;
  purchases: PurchaseRow[];
}

export interface CurrencyTotals {
  currency: PurchaseCurrency;
  invested: number;
  currentValue: number;
  gain: number;
  gainPercent: number;
}

export function groupKey(p: Pick<Purchase, "asset_type" | "symbol">) {
  return `${p.asset_type}:${p.symbol.toLowerCase()}`;
}

/**
 * Arma los grupos por activo y los totales por moneda. Los activos sin
 * cotización disponible quedan afuera de los totales (no se puede saber su
 * valor de hoy), pero igual aparecen en la lista.
 */
export function buildPurchases(
  purchases: Purchase[],
  prices: Map<string, number | null>,
) {
  const groups = new Map<string, AssetGroup>();

  for (const purchase of purchases) {
    const key = groupKey(purchase);
    const price = prices.get(key) ?? null;
    const currentValue = price === null ? null : purchase.quantity * price;
    const gain = currentValue === null ? null : currentValue - purchase.invested;

    const row: PurchaseRow = {
      purchase,
      currentValue,
      gain,
      gainPercent:
        gain === null ? null : (gain / purchase.invested) * 100,
    };

    const group = groups.get(key) ?? {
      key,
      name: purchase.name,
      symbol: purchase.symbol,
      assetType: purchase.asset_type,
      currency: purchaseCurrency(purchase.asset_type),
      price,
      invested: 0,
      currentValue: price === null ? null : 0,
      gain: price === null ? null : 0,
      gainPercent: null,
      purchases: [],
    };

    group.invested += purchase.invested;
    if (currentValue !== null && group.currentValue !== null) {
      group.currentValue += currentValue;
      group.gain = group.currentValue - group.invested;
    }
    group.purchases.push(row);
    groups.set(key, group);
  }

  const list = [...groups.values()].map((g) => ({
    ...g,
    gainPercent:
      g.gain !== null && g.invested > 0 ? (g.gain / g.invested) * 100 : null,
  }));
  list.sort((a, b) => b.invested - a.invested);

  const totals = new Map<PurchaseCurrency, CurrencyTotals>();
  for (const g of list) {
    if (g.currentValue === null) continue;
    const t = totals.get(g.currency) ?? {
      currency: g.currency,
      invested: 0,
      currentValue: 0,
      gain: 0,
      gainPercent: 0,
    };
    t.invested += g.invested;
    t.currentValue += g.currentValue;
    t.gain = t.currentValue - t.invested;
    t.gainPercent = t.invested > 0 ? (t.gain / t.invested) * 100 : 0;
    totals.set(g.currency, t);
  }

  return {
    groups: list,
    totals: [...totals.values()].sort((a, b) =>
      a.currency === "USD" ? -1 : b.currency === "USD" ? 1 : 0,
    ),
    withoutPrice: list.filter((g) => g.currentValue === null),
  };
}
