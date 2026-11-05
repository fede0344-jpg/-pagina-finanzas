// Lector del CSV de transacciones de Nexo. Función pura (sin dependencias de
// la app) para poder correrla en el navegador: el archivo no sale de la compu
// hasta que la persona confirma la carga.

export interface ImportedPurchase {
  ticker: string; // "BTC"
  name: string; // "Bitcoin"
  date: string; // "2026-06-04" (hora de Argentina)
  invested: number; // USD que salieron de la cuenta
  quantity: number; // cantidad recibida del activo
  price: number; // invested / quantity
  ref: string; // id de la transacción en Nexo
}

export interface NexoParseResult {
  purchases: ImportedPurchase[];
  // Operaciones que no son compras, contadas por tipo (en castellano).
  skipped: Record<string, number>;
  // Intereses ganados por moneda (no son compras: no tienen costo).
  interest: Record<string, number>;
}

// Monedas atadas al dólar: cambiar una de estas por cripto es "comprar" cripto.
const USD_STABLE = new Set(["USDT", "USDC", "DAI", "USDP", "TUSD", "PYUSD", "USD"]);

const NAMES: Record<string, string> = {
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
  const iDate = col("Date / Time (UTC)");

  if ([iType, iInCur, iInAmt, iOutCur, iOutAmt, iDate].some((i) => i < 0)) {
    throw new Error("No parece un archivo de transacciones de Nexo.");
  }

  const result: NexoParseResult = { purchases: [], skipped: {}, interest: {} };
  const skip = (label: string) => {
    result.skipped[label] = (result.skipped[label] ?? 0) + 1;
  };

  for (const r of rows.slice(1)) {
    const type = r[iType]?.trim();
    const inCur = r[iInCur]?.trim().toUpperCase();
    const outCur = r[iOutCur]?.trim().toUpperCase();
    const inAmt = Number(r[iInAmt]);
    const outAmt = Number(r[iOutAmt]);

    if (type === "Interest") {
      result.interest[outCur] = (result.interest[outCur] ?? 0) + outAmt;
      skip(SKIP_LABELS.Interest);
      continue;
    }

    if (type !== "Exchange") {
      skip(SKIP_LABELS[type] ?? type);
      continue;
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
      skip("Intercambios que no son compras con dólares");
      continue;
    }

    result.purchases.push({
      ticker: outCur,
      name: NAMES[outCur] ?? outCur,
      date,
      invested,
      quantity: outAmt,
      price: invested / outAmt,
      ref: r[iRef]?.trim() ?? "",
    });
  }

  return result;
}
