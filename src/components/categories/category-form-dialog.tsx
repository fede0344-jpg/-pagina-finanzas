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
  createCategory,
  updateCategory,
  type CategoryActionState,
} from "@/lib/actions/categories";
import { CATEGORY_COLORS } from "@/lib/validation/category-schema";
import { cn } from "@/lib/utils";
import type { Category } from "@/lib/types/domain";

export function CategoryFormDialog({ category }: { category?: Category }) {
  const isEdit = !!category;
  const action = isEdit
    ? updateCategory.bind(null, category.id)
    : createCategory;
  const [state, formAction, isPending] = useActionState<
    CategoryActionState,
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
              <span className="sr-only">Editar {category.name}</span>
            </Button>
          ) : (
            <Button>
              <Plus className="size-4" />
              Nueva categoría
            </Button>
          )
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Editar categoría" : "Nueva categoría"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Actualizá el nombre, tipo o color."
              : "Creá una categoría para clasificar tus transacciones."}
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              name="name"
              defaultValue={category?.name}
              maxLength={40}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Tipo</Label>
            <div className="flex gap-2">
              <label
                className={cn(
                  "flex-1 cursor-pointer rounded-md border px-3 py-2 text-center text-sm has-[:checked]:border-positive has-[:checked]:bg-positive/10 has-[:checked]:text-positive",
                )}
              >
                <input
                  type="radio"
                  name="kind"
                  value="income"
                  defaultChecked={category ? category.kind === "income" : true}
                  className="sr-only"
                />
                Ingreso
              </label>
              <label
                className={cn(
                  "flex-1 cursor-pointer rounded-md border px-3 py-2 text-center text-sm has-[:checked]:border-negative has-[:checked]:bg-negative/10 has-[:checked]:text-negative",
                )}
              >
                <input
                  type="radio"
                  name="kind"
                  value="expense"
                  defaultChecked={category?.kind === "expense"}
                  className="sr-only"
                />
                Gasto
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Color</Label>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_COLORS.map((color) => (
                <label key={color} className="cursor-pointer">
                  <input
                    type="radio"
                    name="color"
                    value={color}
                    defaultChecked={
                      (category?.color ?? CATEGORY_COLORS.at(-1)) === color
                    }
                    className="peer sr-only"
                  />
                  <span
                    className="block size-7 rounded-full ring-2 ring-transparent ring-offset-2 ring-offset-popover peer-checked:ring-foreground"
                    style={{ backgroundColor: color }}
                  />
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
