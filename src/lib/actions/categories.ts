"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/supabase/auth";
import { categorySchema } from "@/lib/validation/category-schema";

export type CategoryActionState = { error: string } | null;

function parseCategoryForm(formData: FormData) {
  return categorySchema.safeParse({
    name: formData.get("name"),
    kind: formData.get("kind"),
    color: formData.get("color"),
  });
}

export async function createCategory(
  _prevState: CategoryActionState,
  formData: FormData,
): Promise<CategoryActionState> {
  const user = await getCurrentUser();
  if (!user) return { error: "No autorizado." };

  const parsed = parseCategoryForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("categories").insert(parsed.data);

  if (error) {
    return {
      error:
        error.code === "23505"
          ? "Ya existe una categoría con ese nombre y tipo."
          : "No se pudo crear la categoría.",
    };
  }

  revalidatePath("/categorias");
  revalidatePath("/transacciones");
  return null;
}

export async function updateCategory(
  categoryId: string,
  _prevState: CategoryActionState,
  formData: FormData,
): Promise<CategoryActionState> {
  const user = await getCurrentUser();
  if (!user) return { error: "No autorizado." };

  const parsed = parseCategoryForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("categories")
    .update(parsed.data)
    .eq("id", categoryId)
    .eq("user_id", user.id);

  if (error) {
    return {
      error:
        error.code === "23505"
          ? "Ya existe una categoría con ese nombre y tipo."
          : "No se pudo actualizar la categoría.",
    };
  }

  revalidatePath("/categorias");
  revalidatePath("/transacciones");
  return null;
}

export async function deleteCategory(categoryId: string) {
  const user = await getCurrentUser();
  if (!user) return;

  const supabase = await createClient();
  await supabase
    .from("categories")
    .delete()
    .eq("id", categoryId)
    .eq("user_id", user.id);

  revalidatePath("/categorias");
  revalidatePath("/transacciones");
}
