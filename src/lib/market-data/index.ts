import "server-only";
import {
  getCoinGeckoQuote,
  getCoinGeckoHistory,
  getCoinGeckoPriceOnDate,
} from "./coingecko";
import {
  getData912Quote,
  getData912History,
  getData912PriceOnDate,
} from "./data912";
import { normalizeCryptoSymbol } from "./crypto-ids";
import type { AssetType } from "@/lib/types/database.types";
import type { AssetMarketData, HistoryRange, MarketSeriesPoint } from "./types";

export type {
  MarketQuote,
  MarketSeriesPoint,
  AssetMarketData,
  HistoryRange,
} from "./types";
export { HISTORY_RANGES } from "./types";
export { calculatePeriodReturn } from "./calculate";
export { getDolarRates } from "./dolar";
export type { DolarRate } from "./dolar";

const RANGE_DAYS: Record<Exclude<HistoryRange, "todo">, number> = {
  "1D": 1,
  "1S": 7,
  "1M": 30,
  "6M": 182,
  "1A": 365,
};

// CoinGecko (gratis) no deja pedir más de 365 días, así que "Todo" en
// cripto muestra el máximo permitido en vez de quedar vacío.
const CRYPTO_MAX_DAYS = 365;

type AssetRef = { asset_type: AssetType; symbol: string };

// En cripto aceptamos el ticker (BTC) o el id de CoinGecko (bitcoin).
function marketSymbol(asset: AssetRef): string {
  return asset.asset_type === "crypto"
    ? normalizeCryptoSymbol(asset.symbol)
    : asset.symbol;
}

export async function getAssetHistory(
  asset: AssetRef,
  range: HistoryRange = "1A",
): Promise<MarketSeriesPoint[]> {
  if (asset.asset_type === "crypto") {
    return getCoinGeckoHistory(
      marketSymbol(asset),
      range === "todo" ? CRYPTO_MAX_DAYS : RANGE_DAYS[range],
    );
  }
  return getData912History(
    asset.asset_type,
    asset.symbol,
    range === "todo" ? "all" : RANGE_DAYS[range],
  );
}

export async function getAssetMarketData(
  asset: AssetRef,
  range: HistoryRange = "1A",
): Promise<AssetMarketData> {
  const quotePromise =
    asset.asset_type === "crypto"
      ? getCoinGeckoQuote(marketSymbol(asset))
      : getData912Quote(asset.asset_type, asset.symbol);

  const [quote, series] = await Promise.all([
    quotePromise,
    getAssetHistory(asset, range),
  ]);
  return { quote, series };
}

/** Precio actual (cripto en USD; el resto en pesos). */
export async function getAssetPrice(asset: AssetRef): Promise<number | null> {
  const quote =
    asset.asset_type === "crypto"
      ? await getCoinGeckoQuote(marketSymbol(asset))
      : await getData912Quote(asset.asset_type, asset.symbol);
  return quote?.price ?? null;
}

/** Precio de cierre en una fecha pasada; si la fecha es hoy, el precio actual. */
export async function getAssetPriceOnDate(
  asset: AssetRef,
  isoDate: string,
): Promise<number | null> {
  if (isoDate >= new Date().toISOString().slice(0, 10)) {
    return getAssetPrice(asset);
  }
  return asset.asset_type === "crypto"
    ? getCoinGeckoPriceOnDate(marketSymbol(asset), isoDate)
    : getData912PriceOnDate(asset.asset_type, asset.symbol, isoDate);
}
