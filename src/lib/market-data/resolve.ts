import "server-only";
import { getCoinGeckoQuote, searchCoinGeckoId } from "./coingecko";
import { isKnownCryptoTicker, normalizeCryptoSymbol } from "./crypto-ids";
import type { AssetType } from "@/lib/types/database.types";

/**
 * Deja el símbolo en la forma que usa el proveedor de precios. En cripto
 * acepta "BTC" o "bitcoin" y, si es una moneda menos común, la busca por
 * nombre o ticker en CoinGecko. El resto de los activos queda como vino.
 */
export async function resolveSymbol(
  assetType: AssetType,
  symbol: string,
): Promise<string> {
  if (assetType !== "crypto") return symbol.trim();

  let id = normalizeCryptoSymbol(symbol);
  if (!isKnownCryptoTicker(symbol) && !(await getCoinGeckoQuote(id))) {
    id = (await searchCoinGeckoId(symbol)) ?? id;
  }
  return id;
}
