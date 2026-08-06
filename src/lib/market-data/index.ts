import "server-only";
import { getCoinGeckoQuote, getCoinGeckoHistory } from "./coingecko";
import { getData912Quote, getData912History } from "./data912";
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

export async function getAssetHistory(
  asset: AssetRef,
  range: HistoryRange = "1A",
): Promise<MarketSeriesPoint[]> {
  if (asset.asset_type === "crypto") {
    return getCoinGeckoHistory(
      asset.symbol,
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
      ? getCoinGeckoQuote(asset.symbol)
      : getData912Quote(asset.asset_type, asset.symbol);

  const [quote, series] = await Promise.all([
    quotePromise,
    getAssetHistory(asset, range),
  ]);
  return { quote, series };
}
