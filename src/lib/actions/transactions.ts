"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/supabase/auth";
import { transactionSchema } from "@/lib/validation/transaction-schema";

export type TransactionActionState = { error: string } | null;

function parseTransactionForm(formData: FormData) {
  return transactionSchema.safeParse({
    type: formData.get("type"),
    category_id: formData.get("category_id"),
    amount: formData.get("amount"),
    occurred_on: formData.get("occurred_on"),
    description: formData.get("description"),
  });
}

export async function createTransaction(
  _prevState: TransactionActionState,
  formData: FormData,
): Promise<TransactionActionState> {
  const user = await getCurrentUser();
  if (!user) return { error: "No autorizado." };

  const parsed = parseTransactionForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("transactions").insert(parsed.data);

  if (error) {
    return { error: "No se pudo guardar la transacción." };
  }

  revalidatePath("/transacciones");
  revalidatePath("/dashboard");
  return null;
}

export async function updateTransaction(
  transactionId: string,
  _prevState: TransactionActionState,
  formData: FormData,
): Promise<TransactionActionState> {
  const user = await getCurrentUser();
  if (!user) return { error: "No autorizado." };

  const parsed = parseTransactionForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("transactions")
    .update(parsed.data)
    .eq("id", transactionId)
    .eq("user_id", user.id);

  if (error) {
    return { error: "No se pudo actualizar la transacción." };
  }

  revalidatePath("/transacciones");
  revalidatePath("/dashboard");
  return null;
}

export async function deleteTransaction(transactionId: string) {
  const user = await getCurrentUser();
  if (!user) return;

  const supabase = await createClient();
  await supabase
    .from("transactions")
    .delete()
    .eq("id", transactionId)
    .eq("user_id", user.id);

  revalidatePath("/transacciones");
  revalidatePath("/dashboard");
}
