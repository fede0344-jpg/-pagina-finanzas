// CoinGecko identifica las monedas por un id ("bitcoin"), no por el ticker
// ("BTC"). Esta tabla traduce los tickers más usados para que la gente pueda
// escribir cualquiera de los dos.
const TICKER_TO_ID: Record<string, string> = {
  btc: "bitcoin",
  eth: "ethereum",
  sol: "solana",
  usdt: "tether",
  usdc: "usd-coin",
  dai: "dai",
  bnb: "binancecoin",
  xrp: "ripple",
  ada: "cardano",
  doge: "dogecoin",
  dot: "polkadot",
  pol: "polygon-ecosystem-token",
  matic: "matic-network",
  avax: "avalanche-2",
  link: "chainlink",
  ltc: "litecoin",
  trx: "tron",
  atom: "cosmos",
  shib: "shiba-inu",
  ton: "the-open-network",
  near: "near",
  uni: "uniswap",
  xlm: "stellar",
  etc: "ethereum-classic",
  bch: "bitcoin-cash",
  sui: "sui",
  apt: "aptos",
  arb: "arbitrum",
  op: "optimism",
  pepe: "pepe",
};

/** "BTC", "btc" o "bitcoin" → "bitcoin". Lo que no conoce lo deja en minúscula. */
export function normalizeCryptoSymbol(symbol: string): string {
  const key = symbol.trim().toLowerCase();
  return TICKER_TO_ID[key] ?? key;
}

export function isKnownCryptoTicker(symbol: string): boolean {
  return symbol.trim().toLowerCase() in TICKER_TO_ID;
}
