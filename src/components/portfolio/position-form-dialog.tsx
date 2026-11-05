"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Pencil, Plus } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createPosition,
  updatePosition,
  type PortfolioActionState,
} from "@/lib/actions/portfolio";
import { isQuantityPosition } from "@/lib/portfolio/aggregate";
import { cn } from "@/lib/utils";
import type { PortfolioPosition } from "@/lib/types/domain";
import type { AssetType } from "@/lib/types/database.types";

type Mode = "amount" | "quantity";

const MODES: { value: Mode; label: string; hint: string }[] = [
  { value: "amount", label: "Por monto", hint: "Cuánta plata tenés" },
  { value: "quantity", label: "Por cantidad", hint: "Ej: 0,5 BTC" },
];

const CURRENCIES = [
  { value: "ARS", label: "Pesos (ARS)" },
  { value: "USD", label: "Dólares (USD)" },
] as const;

const ASSET_TYPES: { value: AssetType; label: string; placeholder: string }[] = [
  { value: "crypto", label: "Cripto", placeholder: "ej: BTC, ETH, SOL" },
  { value: "cedear", label: "CEDEAR", placeholder: "ej: AAPL, TSLA" },
  { value: "accion_arg", label: "Acción arg.", placeholder: "ej: GGAL, YPFD" },
  { value: "bono_arg", label: "Bono arg.", placeholder: "ej: AL30, GD30" },
];

export function PositionFormDialog({
  position,
}: {
  position?: PortfolioPosition;
}) {
  const isEdit = !!position;
  const action = isEdit ? updatePosition.bind(null, position.id) : createPosition;
  const [state, formAction, isPending] = useActionState<
    PortfolioActionState,
    FormData
  >(action, null);
  const [open, setOpen] = useState(false);
  const wasPending = useRef(false);

  const [mode, setMode] = useState<Mode>(
    position && isQuantityPosition(position) ? "quantity" : "amount",
  );
  const [assetType, setAssetType] = useState<AssetType>(
    position?.asset_type ?? "crypto",
  );
  const activeType = ASSET_TYPES.find((t) => t.value === assetType)!;

  useEffect(() => {
    if (wasPending.current && !isPending && !state) {
      setOpen(false);
    }
    wasPending.current = isPending;
  }, [isPending, state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          isEdit ? (
            <Button variant="ghost" size="icon-sm">
              <Pencil className="size-4" />
              <span className="sr-only">Editar {position.name}</span>
            </Button>
          ) : (
            <Button>
              <Plus className="size-4" />
              Agregar activo
            </Button>
          )
        }
      />
      <DialogContent className="max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar activo" : "Agregar activo"}</DialogTitle>
          <DialogDescription>
            Cargá cuánto tenés en este activo, en plata o en cantidad. El
            porcentaje de la torta se calcula solo.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} className="flex flex-col gap-4">
          <input type="hidden" name="mode" value={mode} />

          <div className="grid grid-cols-2 gap-2">
            {MODES.map((m) => (
              <button
                key={m.value}
                type="button"
                onClick={() => setMode(m.value)}
                aria-pressed={mode === m.value}
                className={cn(
                  "rounded-xl border px-3 py-2 text-left transition-colors",
                  mode === m.value
                    ? "border-primary bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted",
                )}
              >
                <span className="block text-sm font-bold">{m.label}</span>
                <span className="block text-xs">{m.hint}</span>
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Activo</Label>
            <Input
              id="name"
              name="name"
              defaultValue={position?.name}
              maxLength={40}
              placeholder="ej: Bitcoin, Plazo fijo, Apple"
              required
            />
          </div>

          {mode === "amount" ? (
            <>
              <div className="flex flex-col gap-2">
                <Label htmlFor="amount">Monto</Label>
                <Input
                  id="amount"
                  name="amount"
                  inputMode="decimal"
                  defaultValue={
                    position?.amount != null ? String(position.amount) : undefined
                  }
                  placeholder="ej: 1500 o 1.500,50"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label>Moneda</Label>
                <div className="flex gap-2">
                  {CURRENCIES.map((c) => (
                    <label
                      key={c.value}
                      className="flex-1 cursor-pointer rounded-xl border px-3 py-2 text-center text-sm font-semibold has-[:checked]:border-primary has-[:checked]:bg-primary/10 has-[:checked]:text-primary"
                    >
                      <input
                        type="radio"
                        name="currency"
                        value={c.value}
                        defaultChecked={
                          (position?.currency ?? "USD") === c.value
                        }
                        className="sr-only"
                      />
                      {c.label}
                    </label>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col gap-2">
                <Label>Tipo</Label>
                <div className="flex flex-wrap gap-2">
                  {ASSET_TYPES.map((t) => (
                    <label
                      key={t.value}
                      className="flex-1 cursor-pointer rounded-xl border px-3 py-2 text-center text-sm font-semibold whitespace-nowrap has-[:checked]:border-primary has-[:checked]:bg-primary/10 has-[:checked]:text-primary"
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

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="symbol">Símbolo</Label>
                  <Input
                    id="symbol"
                    name="symbol"
                    defaultValue={position?.symbol ?? undefined}
                    maxLength={20}
                    placeholder={activeType.placeholder}
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="quantity">Cantidad</Label>
                  <Input
                    id="quantity"
                    name="quantity"
                    inputMode="decimal"
                    defaultValue={
                      position?.quantity != null
                        ? String(position.quantity)
                        : undefined
                    }
                    placeholder="ej: 0,5 o 0.025"
                    required
                  />
                </div>
              </div>
              <p className="-mt-2 text-xs text-muted-foreground">
                El valor se calcula con el precio de hoy
                {assetType === "crypto" ? " en dólares" : " en pesos"} y se
                actualiza solo.
              </p>
            </>
          )}

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
      </DialogContent>
    </Dialog>
  );
}
