import "server-only";
import { getDolarRates } from "./dolar";
import { getCoinGeckoQuote } from "./coingecko";

export interface TickerItem {
  label: string;
  value: number;
  currency: "ARS" | "USD";
  changePercent: number | null;
}

export async function getTickerItems(): Promise<TickerItem[]> {
  const [rates, bitcoin] = await Promise.all([
    getDolarRates(),
    getCoinGeckoQuote("bitcoin"),
  ]);

  const items: TickerItem[] = [];

  // El euro comparte el valor "oficial" en `casa`, así que hay que mirar
  // también la moneda para no confundirlo con el dólar.
  const pick = (moneda: string, casa: string, label: string) => {
    const rate = rates.find((r) => r.moneda === moneda && r.casa === casa);
    if (rate) {
      items.push({
        label,
        value: rate.venta,
        currency: "ARS",
        changePercent: null,
      });
    }
  };

  pick("USD", "blue", "Dólar blue");
  pick("USD", "oficial", "Dólar oficial");
  pick("EUR", "oficial", "Euro");

  if (bitcoin) {
    items.push({
      label: "Bitcoin",
      value: bitcoin.price,
      currency: "USD",
      changePercent: bitcoin.changePercent,
    });
  }

  return items;
}
