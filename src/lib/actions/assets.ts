"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/supabase/auth";
import { assetSchema } from "@/lib/validation/asset-schema";
import { getAssetMarketData, getAssetHistory, getDolarRates } from "@/lib/market-data";
import type { Asset } from "@/lib/types/domain";
import type { AssetType } from "@/lib/types/database.types";
import type {
  AssetMarketData,
  HistoryRange,
  MarketSeriesPoint,
} from "@/lib/market-data/types";
import type { DolarRate } from "@/lib/market-data/dolar";

export type AssetActionState = { error: string } | null;

function parseAssetForm(formData: FormData) {
  return assetSchema.safeParse({
    name: formData.get("name"),
    asset_type: formData.get("asset_type"),
    symbol: formData.get("symbol"),
    risk_level: formData.get("risk_level"),
  });
}

export async function createAsset(
  _prevState: AssetActionState,
  formData: FormData,
): Promise<AssetActionState> {
  const user = await getCurrentUser();
  if (!user) return { error: "No autorizado." };

  const parsed = parseAssetForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("assets").insert(parsed.data);

  if (error) {
    return {
      error:
        error.code === "23505"
          ? "Ya tenés ese activo cargado."
          : "No se pudo agregar el activo.",
    };
  }

  revalidatePath("/inversiones");
  return null;
}

export async function updateAsset(
  assetId: string,
  _prevState: AssetActionState,
  formData: FormData,
): Promise<AssetActionState> {
  const user = await getCurrentUser();
  if (!user) return { error: "No autorizado." };

  const parsed = parseAssetForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("assets")
    .update(parsed.data)
    .eq("id", assetId)
    .eq("user_id", user.id);

  if (error) {
    return {
      error:
        error.code === "23505"
          ? "Ya tenés ese activo cargado."
          : "No se pudo actualizar el activo.",
    };
  }

  revalidatePath("/inversiones");
  return null;
}

export async function deleteAsset(assetId: string) {
  const user = await getCurrentUser();
  if (!user) return;

  const supabase = await createClient();
  await supabase
    .from("assets")
    .delete()
    .eq("id", assetId)
    .eq("user_id", user.id);

  revalidatePath("/inversiones");
}

export async function getAssetHistoryForRange(
  asset: { asset_type: AssetType; symbol: string },
  range: HistoryRange,
): Promise<MarketSeriesPoint[]> {
  return getAssetHistory(asset, range);
}

export interface InvestmentsData {
  items: { asset: Asset; data: AssetMarketData }[];
  dolarRates: DolarRate[];
}

export async function getInvestmentsData(): Promise<InvestmentsData> {
  const user = await getCurrentUser();
  if (!user) return { items: [], dolarRates: [] };

  const supabase = await createClient();
  const [{ data: assets }, dolarRates] = await Promise.all([
    supabase.from("assets").select("*").order("created_at"),
    getDolarRates(),
  ]);

  const items = await Promise.all(
    (assets ?? []).map(async (asset) => ({
      asset,
      data: await getAssetMarketData(asset),
    })),
  );

  return { items, dolarRates };
}
