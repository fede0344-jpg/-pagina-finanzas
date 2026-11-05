"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/supabase/auth";
import { portfolioSchema } from "@/lib/validation/portfolio-schema";
import { getAssetPrice } from "@/lib/market-data";
import { resolveSymbol } from "@/lib/market-data/resolve";
import { purchaseCurrency } from "@/lib/purchases/aggregate";
import type { Database } from "@/lib/types/database.types";

export type PortfolioActionState = { error: string } | null;

type PositionRow = Database["public"]["Tables"]["portfolio_positions"]["Insert"];

// Convierte el formulario en la fila a guardar. Si se cargó por cantidad,
// resuelve el símbolo y verifica que exista un precio para ese activo.
async function buildRow(
  formData: FormData,
): Promise<{ row: PositionRow } | { error: string }> {
  const parsed = portfolioSchema.safeParse({
    mode: formData.get("mode") ?? "amount",
    name: formData.get("name"),
    amount: formData.get("amount") ?? "",
    currency: formData.get("currency"),
    asset_type: formData.get("asset_type"),
    symbol: formData.get("symbol"),
    quantity: formData.get("quantity") ?? "",
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  const data = parsed.data;
  if (data.mode === "amount") {
    return {
      row: {
        name: data.name,
        amount: data.amount,
        currency: data.currency,
        asset_type: null,
        symbol: null,
        quantity: null,
      },
    };
  }

  const symbol = await resolveSymbol(data.asset_type, data.symbol);
  const price = await getAssetPrice({ asset_type: data.asset_type, symbol });
  if (!price) {
    return {
      error:
        "No encontramos el precio de ese activo. Revisá el símbolo (en cripto podés usar BTC, ETH, SOL…).",
    };
  }

  return {
    row: {
      name: data.name,
      amount: null,
      currency: purchaseCurrency(data.asset_type),
      asset_type: data.asset_type,
      symbol,
      quantity: data.quantity,
    },
  };
}

export async function createPosition(
  _prevState: PortfolioActionState,
  formData: FormData,
): Promise<PortfolioActionState> {
  const user = await getCurrentUser();
  if (!user) return { error: "No autorizado." };

  const built = await buildRow(formData);
  if ("error" in built) return { error: built.error };

  const supabase = await createClient();
  const { error } = await supabase
    .from("portfolio_positions")
    .insert(built.row);

  if (error) return { error: "No se pudo agregar el activo." };

  revalidatePath("/portafolio");
  return null;
}

export async function updatePosition(
  positionId: string,
  _prevState: PortfolioActionState,
  formData: FormData,
): Promise<PortfolioActionState> {
  const user = await getCurrentUser();
  if (!user) return { error: "No autorizado." };

  const built = await buildRow(formData);
  if ("error" in built) return { error: built.error };

  const supabase = await createClient();
  const { error } = await supabase
    .from("portfolio_positions")
    .update(built.row)
    .eq("id", positionId)
    .eq("user_id", user.id);

  if (error) return { error: "No se pudo actualizar el activo." };

  revalidatePath("/portafolio");
  return null;
}

export async function deletePosition(positionId: string) {
  const user = await getCurrentUser();
  if (!user) return;

  const supabase = await createClient();
  await supabase
    .from("portfolio_positions")
    .delete()
    .eq("id", positionId)
    .eq("user_id", user.id);

  revalidatePath("/portafolio");
}
