"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/supabase/auth";
import { purchaseSchema } from "@/lib/validation/purchase-schema";
import { getAssetPriceOnDate } from "@/lib/market-data";
import { resolveSymbol } from "@/lib/market-data/resolve";

export type PurchaseActionState = { error: string } | null;

export async function createPurchase(
  _prevState: PurchaseActionState,
  formData: FormData,
): Promise<PurchaseActionState> {
  const user = await getCurrentUser();
  if (!user) return { error: "No autorizado." };

  const parsed = purchaseSchema.safeParse({
    name: formData.get("name"),
    asset_type: formData.get("asset_type"),
    symbol: formData.get("symbol"),
    purchase_date: formData.get("purchase_date"),
    invested: formData.get("invested"),
    buy_price: formData.get("buy_price") ?? "",
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  const { buy_price: manualPrice, ...data } = parsed.data;

  // En cripto guardamos el id de CoinGecko (acepta BTC o bitcoin).
  data.symbol = await resolveSymbol(data.asset_type, data.symbol);
  const buyPrice =
    manualPrice ??
    (await getAssetPriceOnDate(
      { asset_type: data.asset_type, symbol: data.symbol },
      data.purchase_date,
    ));

  if (!buyPrice) {
    return {
      error:
        "No pudimos obtener el precio de ese activo en esa fecha. Revisá el símbolo o cargá el precio de compra a mano.",
    };
  }

  // La cantidad queda guardada: así el rendimiento no cambia si después
  // el historial de precios se corrige o deja de estar disponible.
  const quantity = data.invested / buyPrice;

  const supabase = await createClient();
  const { error } = await supabase.from("purchases").insert({
    ...data,
    buy_price: buyPrice,
    quantity,
  });

  if (error) return { error: "No se pudo guardar la compra." };

  revalidatePath("/inversiones/compras");
  return null;
}

export async function deletePurchase(purchaseId: string) {
  const user = await getCurrentUser();
  if (!user) return;

  const supabase = await createClient();
  await supabase
    .from("purchases")
    .delete()
    .eq("id", purchaseId)
    .eq("user_id", user.id);

  revalidatePath("/inversiones/compras");
}
