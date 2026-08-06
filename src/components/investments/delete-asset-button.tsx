"use client";

import { deleteAsset } from "@/lib/actions/assets";
import { ConfirmDeleteButton } from "@/components/shared/confirm-delete-button";
import { useInvestmentsRefresh } from "./investments-refresh-context";

export function DeleteAssetButton({
  assetId,
  assetName,
}: {
  assetId: string;
  assetName: string;
}) {
  const refresh = useInvestmentsRefresh();

  return (
    <ConfirmDeleteButton
      srLabel={`Eliminar ${assetName}`}
      title={`¿Eliminar "${assetName}"?`}
      description="Esta acción no se puede deshacer."
      onConfirm={async () => {
        await deleteAsset(assetId);
        refresh();
      }}
    />
  );
}
