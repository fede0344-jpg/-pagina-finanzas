"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/supabase/auth";
import { portfolioSchema } from "@/lib/validation/portfolio-schema";

export type PortfolioActionState = { error: string } | null;

function parseForm(formData: FormData) {
  return portfolioSchema.safeParse({
    name: formData.get("name"),
    amount: formData.get("amount"),
    currency: formData.get("currency"),
  });
}

export async function createPosition(
  _prevState: PortfolioActionState,
  formData: FormData,
): Promise<PortfolioActionState> {
  const user = await getCurrentUser();
  if (!user) return { error: "No autorizado." };

  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("portfolio_positions")
    .insert(parsed.data);

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

  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("portfolio_positions")
    .update(parsed.data)
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
