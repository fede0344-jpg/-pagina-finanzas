import type { AssetType } from "@/lib/types/database.types";

// CoinGecko ids (used as our `symbol` for crypto assets) -> Binance ticker.
const CRYPTO_TICKERS: Record<string, string> = {
  bitcoin: "BTC",
  ethereum: "ETH",
  solana: "SOL",
  cardano: "ADA",
  ripple: "XRP",
  dogecoin: "DOGE",
  litecoin: "LTC",
  polkadot: "DOT",
  chainlink: "LINK",
  binancecoin: "BNB",
  tron: "TRX",
  "matic-network": "MATIC",
  "avalanche-2": "AVAX",
  stellar: "XLM",
  "shiba-inu": "SHIB",
  uniswap: "UNI",
  cosmos: "ATOM",
  "near-protocol": "NEAR",
};

export function getTradingViewSymbol(asset: {
  asset_type: AssetType;
  symbol: string;
}): string {
  if (asset.asset_type === "crypto") {
    const ticker =
      CRYPTO_TICKERS[asset.symbol.toLowerCase()] ?? asset.symbol.toUpperCase();
    return `BINANCE:${ticker}USDT`;
  }
  // CEDEARs, acciones y bonos argentinos cotizan en BYMA/BCBA.
  return `BCBA:${asset.symbol.toUpperCase()}`;
}
