"use client";

import { deleteTransaction } from "@/lib/actions/transactions";
import { ConfirmDeleteButton } from "@/components/shared/confirm-delete-button";

export function DeleteTransactionButton({
  transactionId,
}: {
  transactionId: string;
}) {
  return (
    <ConfirmDeleteButton
      srLabel="Eliminar transacción"
      title="¿Eliminar esta transacción?"
      description="Esta acción no se puede deshacer."
      onConfirm={() => deleteTransaction(transactionId)}
    />
  );
}
