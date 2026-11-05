"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/supabase/auth";
import { resolveSymbol } from "@/lib/market-data/resolve";
import { normalizeCryptoSymbol } from "@/lib/market-data/crypto-ids";

export type ImportActionResult =
  | { error: string }
  | { inserted: number; skipped: number };

const MAX_ROWS = 500;

const rowSchema = z.object({
  ticker: z.string().trim().min(1).max(20),
  name: z.string().trim().min(1).max(60),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .refine((d) => d >= "2000-01-01" && d <= new Date().toISOString().slice(0, 10)),
  invested: z.number().positive().max(1_000_000_000_000),
  quantity: z.number().positive().max(1_000_000_000_000),
});

/**
 * Carga varias compras de cripto de una vez (por ejemplo, las leídas de un
 * CSV). Se guardan con la sesión de la persona, así que quedan solo en su
 * cuenta. Las que ya existen (mismo activo, fecha y monto) se saltean.
 */
export async function importPurchases(
  rows: unknown,
): Promise<ImportActionResult> {
  const user = await getCurrentUser();
  if (!user) return { error: "No autorizado." };

  const parsed = z.array(rowSchema).max(MAX_ROWS).safeParse(rows);
  if (!parsed.success) {
    return { error: "El archivo tiene datos que no se pueden cargar." };
  }
  if (parsed.data.length === 0) return { inserted: 0, skipped: 0 };

  // Un símbolo de CoinGecko por ticker (BTC → bitcoin, NEXO → nexo).
  const tickers = [...new Set(parsed.data.map((r) => r.ticker))];
  const symbols = new Map(
    await Promise.all(
      tickers.map(
        async (t) => [t, await resolveSymbol("crypto", t)] as const,
      ),
    ),
  );

  const supabase = await createClient();
  const { data: existing, error: readError } = await supabase
    .from("purchases")
    .select("symbol, purchase_date, invested")
    .eq("asset_type", "crypto");
  if (readError) return { error: "No se pudieron revisar tus compras." };

  const isDuplicate = (symbol: string, date: string, invested: number) =>
    (existing ?? []).some(
      (e) =>
        normalizeCryptoSymbol(e.symbol) === normalizeCryptoSymbol(symbol) &&
        e.purchase_date === date &&
        Math.abs(e.invested - invested) < 0.01,
    );

  const toInsert = parsed.data
    .filter((r) => !isDuplicate(symbols.get(r.ticker)!, r.date, r.invested))
    .map((r) => ({
      asset_type: "crypto" as const,
      symbol: symbols.get(r.ticker)!,
      name: r.name,
      purchase_date: r.date,
      invested: Math.round(r.invested * 100) / 100,
      buy_price: r.invested / r.quantity,
      quantity: r.quantity,
    }));

  if (toInsert.length > 0) {
    const { error } = await supabase.from("purchases").insert(toInsert);
    if (error) return { error: "No se pudieron guardar las compras." };
  }

  revalidatePath("/inversiones/compras");
  return {
    inserted: toInsert.length,
    skipped: parsed.data.length - toInsert.length,
  };
}
