"use client";

import { deletePurchase } from "@/lib/actions/purchases";
import { ConfirmDeleteButton } from "@/components/shared/confirm-delete-button";

export function DeletePurchaseButton({
  purchaseId,
  label,
}: {
  purchaseId: string;
  label: string;
}) {
  return (
    <ConfirmDeleteButton
      srLabel={`Eliminar compra de ${label}`}
      title="¿Eliminar esta compra?"
      description={`Se saca la compra de ${label} y el rendimiento se recalcula sin ella. Esta acción no se puede deshacer.`}
      onConfirm={() => deletePurchase(purchaseId)}
    />
  );
}
