"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Plus, Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createAsset,
  updateAsset,
  type AssetActionState,
} from "@/lib/actions/assets";
import { useInvestmentsRefresh } from "./investments-refresh-context";
import type { Asset } from "@/lib/types/domain";
import type { AssetType } from "@/lib/types/database.types";

const ASSET_TYPES: { value: AssetType; label: string; placeholder: string }[] = [
  { value: "crypto", label: "Cripto", placeholder: "ej: bitcoin, ethereum" },
  { value: "cedear", label: "CEDEAR", placeholder: "ej: AAPL, TSLA" },
  { value: "accion_arg", label: "Acción argentina", placeholder: "ej: GGAL, YPFD" },
  { value: "bono_arg", label: "Bono argentino", placeholder: "ej: AL30, GD30" },
];

function AssetFormFields({
  asset,
  formAction,
  isPending,
  state,
}: {
  asset?: Asset;
  formAction: (formData: FormData) => void;
  isPending: boolean;
  state: AssetActionState;
}) {
  const [assetType, setAssetType] = useState<AssetType>(
    asset?.asset_type ?? "crypto",
  );
  const activeType = ASSET_TYPES.find((t) => t.value === assetType)!;

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Nombre</Label>
        <Input
          id="name"
          name="name"
          defaultValue={asset?.name}
          maxLength={60}
          placeholder="ej: Bitcoin, Apple, Bono AL30"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Tipo</Label>
        <div className="flex flex-wrap gap-2">
          {ASSET_TYPES.map((t) => (
            <label
              key={t.value}
              className="flex-1 cursor-pointer rounded-md border px-3 py-2 text-center text-sm whitespace-nowrap has-[:checked]:border-primary has-[:checked]:bg-primary/10 has-[:checked]:text-primary"
            >
              <input
                type="radio"
                name="asset_type"
                value={t.value}
                checked={assetType === t.value}
                onChange={() => setAssetType(t.value)}
                className="sr-only"
              />
              {t.label}
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="symbol">Símbolo</Label>
        <Input
          id="symbol"
          name="symbol"
          defaultValue={asset?.symbol}
          maxLength={20}
          placeholder={activeType.placeholder}
          required
        />
        <p className="text-xs text-muted-foreground">
          {assetType === "crypto"
            ? "Usá el id de CoinGecko (en minúscula), no el ticker."
            : "Usá el ticker tal cual cotiza en BYMA."}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Label>Riesgo</Label>
        <div className="flex gap-2">
          <label className="flex-1 cursor-pointer rounded-md border px-3 py-2 text-center text-sm has-[:checked]:border-positive has-[:checked]:bg-positive/10 has-[:checked]:text-positive">
            <input
              type="radio"
              name="risk_level"
              value="bajo"
              defaultChecked={(asset?.risk_level ?? "bajo") === "bajo"}
              className="sr-only"
            />
            Bajo
          </label>
          <label className="flex-1 cursor-pointer rounded-md border px-3 py-2 text-center text-sm has-[:checked]:border-foreground has-[:checked]:bg-muted">
            <input
              type="radio"
              name="risk_level"
              value="medio"
              defaultChecked={asset?.risk_level === "medio"}
              className="sr-only"
            />
            Medio
          </label>
          <label className="flex-1 cursor-pointer rounded-md border px-3 py-2 text-center text-sm has-[:checked]:border-negative has-[:checked]:bg-negative/10 has-[:checked]:text-negative">
            <input
              type="radio"
              name="risk_level"
              value="alto"
              defaultChecked={asset?.risk_level === "alto"}
              className="sr-only"
            />
            Alto
          </label>
        </div>
      </div>

      {state && "error" in state ? (
        <p role="alert" className="text-sm text-negative">
          {state.error}
        </p>
      ) : null}

      <DialogFooter>
        <DialogClose render={<Button type="button" variant="outline" />}>
          Cancelar
        </DialogClose>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Guardando..." : "Guardar"}
        </Button>
      </DialogFooter>
    </form>
  );
}

export function AssetFormDialog({ asset }: { asset?: Asset }) {
  const isEdit = !!asset;
  const action = isEdit ? updateAsset.bind(null, asset.id) : createAsset;
  const [state, formAction, isPending] = useActionState<
    AssetActionState,
    FormData
  >(action, null);
  const [open, setOpen] = useState(false);
  const wasPending = useRef(false);
  const refresh = useInvestmentsRefresh();

  useEffect(() => {
    if (wasPending.current && !isPending && !state) {
      setOpen(false);
      refresh();
    }
    wasPending.current = isPending;
  }, [isPending, state, refresh]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          isEdit ? (
            <Button variant="ghost" size="icon-sm">
              <Pencil className="size-4" />
              <span className="sr-only">Editar {asset.name}</span>
            </Button>
          ) : (
            <Button>
              <Plus className="size-4" />
              Agregar activo
            </Button>
          )
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Editar activo" : "Agregar activo"}
          </DialogTitle>
          <DialogDescription>
            El precio y el gráfico se actualizan solos, no hay que cargarlos.
          </DialogDescription>
        </DialogHeader>
        {open ? (
          <AssetFormFields
            asset={asset}
            formAction={formAction}
            isPending={isPending}
            state={state}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
