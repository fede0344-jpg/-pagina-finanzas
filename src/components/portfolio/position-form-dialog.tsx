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
import type { PortfolioPosition } from "@/lib/types/domain";

const CURRENCIES = [
  { value: "ARS", label: "Pesos (ARS)" },
  { value: "USD", label: "Dólares (USD)" },
] as const;

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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar activo" : "Agregar activo"}</DialogTitle>
          <DialogDescription>
            Cargá cuánto tenés en este activo. El porcentaje de la torta se
            calcula solo.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} className="flex flex-col gap-4">
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

          <div className="flex flex-col gap-2">
            <Label htmlFor="amount">Monto</Label>
            <Input
              id="amount"
              name="amount"
              inputMode="decimal"
              defaultValue={position ? String(position.amount) : undefined}
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
                  className="flex-1 cursor-pointer rounded-md border px-3 py-2 text-center text-sm has-[:checked]:border-primary has-[:checked]:bg-primary/10 has-[:checked]:text-primary"
                >
                  <input
                    type="radio"
                    name="currency"
                    value={c.value}
                    defaultChecked={(position?.currency ?? "USD") === c.value}
                    className="sr-only"
                  />
                  {c.label}
                </label>
              ))}
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
      </DialogContent>
    </Dialog>
  );
}
