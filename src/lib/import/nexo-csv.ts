// Lector del CSV de transacciones de Nexo. Función pura (sin dependencias de
// la app) para poder correrla en el navegador: el archivo no sale de la compu
// hasta que la persona confirma la carga.
//
// Devuelve eventos con el id de la transacción de Nexo, así quien lo use puede
// juntar varios archivos (incluso superpuestos) sin contar nada dos veces.

export interface ImportedPurchase {
  ticker: string; // "BTC"
  name: string; // "Bitcoin"
  date: string; // "2026-06-04" (hora de Argentina)
  invested: number; // USD que salieron de la cuenta
  quantity: number; // cantidad recibida del activo
  price: number; // invested / quantity
  ref: string; // id de la transacción en Nexo
}

export interface BalanceEvent {
  ref: string;
  currency: string;
  delta: number; // + entra a la cuenta, - sale
}

export interface SkippedEvent {
  ref: string;
  label: string; // tipo de operación, en castellano
  interest?: { currency: string; amount: number };
}

export interface NexoParseResult {
  purchases: ImportedPurchase[];
  // Movimiento de cada moneda en la cuenta (solo operaciones aprobadas).
  balance: BalanceEvent[];
  // Operaciones que no son compras.
  skipped: SkippedEvent[];
}

// Monedas atadas al dólar: cambiar una de estas por cripto es "comprar" cripto.
export const USD_STABLE = new Set(["USDT", "USDC", "DAI", "USDP", "TUSD", "PYUSD", "USD"]);

export const CRYPTO_NAMES: Record<string, string> = {
  BTC: "Bitcoin",
  ETH: "Ethereum",
  SOL: "Solana",
  NEXO: "Nexo",
  XRP: "XRP",
  ADA: "Cardano",
  DOGE: "Dogecoin",
  BNB: "BNB",
  LTC: "Litecoin",
  DOT: "Polkadot",
  LINK: "Chainlink",
  AVAX: "Avalanche",
  USDT: "Tether",
  USDC: "USD Coin",
};

const SKIP_LABELS: Record<string, string> = {
  Interest: "Intereses",
  "Top up Crypto": "Depósitos de cripto",
  Withdrawal: "Retiros",
  "Exchange Cashback": "Cashback",
};

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (ch === '"') {
        quoted = false;
      } else {
        cell += ch;
      }
    } else if (ch === '"') {
      quoted = true;
    } else if (ch === ",") {
      row.push(cell);
      cell = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(cell);
      cell = "";
      if (row.some((c) => c !== "")) rows.push(row);
      row = [];
    } else {
      cell += ch;
    }
  }
  row.push(cell);
  if (row.some((c) => c !== "")) rows.push(row);
  return rows;
}

// "2026-06-04 00:46:33" (UTC) → "2026-06-03" (fecha en Argentina, UTC-3).
function argentinaDate(utc: string): string | null {
  const ms = Date.parse(`${utc.trim().replace(" ", "T")}Z`);
  if (Number.isNaN(ms)) return null;
  return new Date(ms - 3 * 3_600_000).toISOString().slice(0, 10);
}

export function parseNexoCsv(text: string): NexoParseResult {
  const rows = parseCsv(text.replace(/^﻿/, ""));
  const header = rows[0]?.map((h) => h.trim()) ?? [];
  const col = (name: string) => header.indexOf(name);

  const iRef = col("Transaction");
  const iType = col("Type");
  const iInCur = col("Input Currency");
  const iInAmt = col("Input Amount");
  const iOutCur = col("Output Currency");
  const iOutAmt = col("Output Amount");
  const iDetails = col("Details");
  const iDate = col("Date / Time (UTC)");

  if ([iType, iInCur, iInAmt, iOutCur, iOutAmt, iDate].some((i) => i < 0)) {
    throw new Error("No parece un archivo de transacciones de Nexo.");
  }

  const result: NexoParseResult = { purchases: [], balance: [], skipped: [] };

  rows.slice(1).forEach((r, n) => {
    const ref = r[iRef]?.trim() || `fila-${n}`;
    const type = r[iType]?.trim();
    const inCur = r[iInCur]?.trim().toUpperCase();
    const outCur = r[iOutCur]?.trim().toUpperCase();
    const inAmt = Number(r[iInAmt]);
    const outAmt = Number(r[iOutAmt]);
    const details = (iDetails >= 0 ? r[iDetails] : "")?.trim().toLowerCase() ?? "";

    // Retiros rechazados o pendientes: no movieron plata.
    if (details && !details.startsWith("approved")) {
      result.skipped.push({ ref, label: "Operaciones rechazadas o pendientes" });
      return;
    }

    if (type === "Exchange") {
      result.balance.push({ ref: `${ref}:in`, currency: inCur, delta: -Math.abs(inAmt) });
      result.balance.push({ ref: `${ref}:out`, currency: outCur, delta: outAmt });
    } else if (type === "Withdrawal") {
      result.balance.push({ ref, currency: inCur, delta: -Math.abs(inAmt) });
    } else {
      result.balance.push({ ref, currency: outCur, delta: outAmt });
    }

    if (type === "Interest") {
      result.skipped.push({
        ref,
        label: SKIP_LABELS.Interest,
        interest: { currency: outCur, amount: outAmt },
      });
      return;
    }

    if (type !== "Exchange") {
      result.skipped.push({ ref, label: SKIP_LABELS[type] ?? type });
      return;
    }

    const date = argentinaDate(r[iDate]);
    const invested = Math.abs(inAmt);
    const isBuy =
      USD_STABLE.has(inCur) &&
      !USD_STABLE.has(outCur) &&
      outAmt > 0 &&
      invested > 0 &&
      date !== null;

    if (!isBuy) {
      result.skipped.push({
        ref,
        label: "Intercambios que no son compras con dólares",
      });
      return;
    }

    result.purchases.push({
      ticker: outCur,
      name: CRYPTO_NAMES[outCur] ?? outCur,
      date,
      invested,
      quantity: outAmt,
      price: invested / outAmt,
      ref,
    });
  });

  return result;
}

/** Suma los movimientos (sin repetir transacciones) y devuelve lo que queda por moneda. */
export function netHoldings(events: BalanceEvent[]): Record<string, number> {
  const seen = new Set<string>();
  const totals: Record<string, number> = {};
  for (const e of events) {
    if (seen.has(e.ref)) continue;
    seen.add(e.ref);
    totals[e.currency] = (totals[e.currency] ?? 0) + e.delta;
  }
  for (const k of Object.keys(totals)) {
    totals[k] = Math.round(totals[k] * 1e8) / 1e8;
  }
  return totals;
}
