"use client";

import { deletePosition } from "@/lib/actions/portfolio";
import { ConfirmDeleteButton } from "@/components/shared/confirm-delete-button";

export function DeletePositionButton({
  positionId,
  positionName,
}: {
  positionId: string;
  positionName: string;
}) {
  return (
    <ConfirmDeleteButton
      srLabel={`Eliminar ${positionName}`}
      title={`¿Eliminar "${positionName}"?`}
      description="Se saca de tu portafolio y el porcentaje del resto se recalcula. Esta acción no se puede deshacer."
      onConfirm={() => deletePosition(positionId)}
    />
  );
}
