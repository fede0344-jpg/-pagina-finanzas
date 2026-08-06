import "server-only";

export interface DolarRate {
  moneda: string;
  casa: string;
  nombre: string;
  compra: number;
  venta: number;
  fechaActualizacion: string;
}

async function fetchJson(url: string): Promise<unknown> {
  const res = await fetch(url, { next: { revalidate: 300 } });
  if (!res.ok) return null;
  return res.json();
}

export async function getDolarRates(): Promise<DolarRate[]> {
  try {
    const [dolares, euro] = await Promise.all([
      fetchJson("https://dolarapi.com/v1/dolares"),
      fetchJson("https://dolarapi.com/v1/cotizaciones/eur"),
    ]);

    const rates: DolarRate[] = [];
    if (Array.isArray(dolares)) {
      rates.push(...(dolares as DolarRate[]));
    }
    if (euro && typeof euro === "object") {
      rates.push(euro as DolarRate);
    }
    return rates;
  } catch {
    return [];
  }
}
