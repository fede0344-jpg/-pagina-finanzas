"use client";

import { deleteCategory } from "@/lib/actions/categories";
import { ConfirmDeleteButton } from "@/components/shared/confirm-delete-button";

export function DeleteCategoryButton({
  categoryId,
  categoryName,
}: {
  categoryId: string;
  categoryName: string;
}) {
  return (
    <ConfirmDeleteButton
      srLabel={`Eliminar ${categoryName}`}
      title={`¿Eliminar "${categoryName}"?`}
      description="Las transacciones que usan esta categoría van a quedar sin categoría. Esta acción no se puede deshacer."
      onConfirm={() => deleteCategory(categoryId)}
    />
  );
}
