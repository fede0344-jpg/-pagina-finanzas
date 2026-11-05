"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/supabase/auth";
import { resolveSymbol } from "@/lib/market-data/resolve";

export type HoldingsActionResult =
  | { error: string }
  | { created: number; updated: number };

const rowSchema = z.object({
  ticker: z.string().trim().min(1).max(20),
  name: z.string().trim().min(1).max(30),
  quantity: z.number().positive().max(1_000_000_000_000),
});

/**
 * Carga lo que hay hoy en una cuenta (por ejemplo, Nexo) al Portafolio, por
 * cantidad. Es una foto del total: si ya se cargó antes, se actualiza la
 * cantidad en vez de duplicar el activo.
 */
export async function importHoldings(
  rows: unknown,
  source: string,
): Promise<HoldingsActionResult> {
  const user = await getCurrentUser();
  if (!user) return { error: "No autorizado." };

  const parsed = z.array(rowSchema).max(50).safeParse(rows);
  if (!parsed.success) {
    return { error: "Hay datos que no se pueden cargar." };
  }
  if (parsed.data.length === 0) return { created: 0, updated: 0 };

  const supabase = await createClient();
  const label = source.trim().slice(0, 8) || "Importado";
  const names = parsed.data.map((r) => `${r.name} (${label})`);

  const { data: existing, error: readError } = await supabase
    .from("portfolio_positions")
    .select("id, name")
    .in("name", names);
  if (readError) return { error: "No se pudo revisar tu portafolio." };

  let created = 0;
  let updated = 0;

  for (const row of parsed.data) {
    const name = `${row.name} (${label})`;
    const symbol = await resolveSymbol("crypto", row.ticker);
    const match = existing?.find((e) => e.name === name);

    if (match) {
      const { error } = await supabase
        .from("portfolio_positions")
        .update({ quantity: row.quantity, symbol, asset_type: "crypto", currency: "USD", amount: null })
        .eq("id", match.id)
        .eq("user_id", user.id);
      if (error) return { error: "No se pudo actualizar tu portafolio." };
      updated++;
    } else {
      const { error } = await supabase.from("portfolio_positions").insert({
        name,
        asset_type: "crypto",
        symbol,
        quantity: row.quantity,
        currency: "USD",
        amount: null,
      });
      if (error) return { error: "No se pudo guardar en tu portafolio." };
      created++;
    }
  }

  revalidatePath("/portafolio");
  return { created, updated };
}
