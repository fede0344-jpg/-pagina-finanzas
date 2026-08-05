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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createTransaction,
  updateTransaction,
  type TransactionActionState,
} from "@/lib/actions/transactions";
import type { Category, Transaction } from "@/lib/types/domain";

function todayISODate() {
  return new Date().toISOString().slice(0, 10);
}

function TransactionFormFields({
  categories,
  transaction,
  formAction,
  isPending,
  state,
}: {
  categories: Category[];
  transaction?: Transaction;
  formAction: (formData: FormData) => void;
  isPending: boolean;
  state: TransactionActionState;
}) {
  const [type, setType] = useState<"income" | "expense">(
    transaction?.type ?? "expense",
  );
  const filteredCategories = categories.filter((c) => c.kind === type);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label>Tipo</Label>
        <div className="flex gap-2">
          <label className="flex-1 cursor-pointer rounded-md border px-3 py-2 text-center text-sm has-[:checked]:border-positive has-[:checked]:bg-positive/10 has-[:checked]:text-positive">
            <input
              type="radio"
              name="type"
              value="income"
              checked={type === "income"}
              onChange={() => setType("income")}
              className="sr-only"
            />
            Ingreso
          </label>
          <label className="flex-1 cursor-pointer rounded-md border px-3 py-2 text-center text-sm has-[:checked]:border-negative has-[:checked]:bg-negative/10 has-[:checked]:text-negative">
            <input
              type="radio"
              name="type"
              value="expense"
              checked={type === "expense"}
              onChange={() => setType("expense")}
              className="sr-only"
            />
            Gasto
          </label>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="amount">Monto</Label>
        <Input
          id="amount"
          name="amount"
          type="number"
          min="0.01"
          step="0.01"
          inputMode="decimal"
          defaultValue={transaction?.amount}
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="occurred_on">Fecha</Label>
        <Input
          id="occurred_on"
          name="occurred_on"
          type="date"
          defaultValue={transaction?.occurred_on ?? todayISODate()}
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Categoría</Label>
        <Select
          key={type}
          name="category_id"
          defaultValue={transaction?.category_id ?? null}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sin categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={null}>Sin categoría</SelectItem>
            {filteredCategories.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="description">Descripción (opcional)</Label>
        <Input
          id="description"
          name="description"
          maxLength={200}
          defaultValue={transaction?.description ?? ""}
        />
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

export function TransactionFormDialog({
  categories,
  transaction,
}: {
  categories: Category[];
  transaction?: Transaction;
}) {
  const isEdit = !!transaction;
  const action = isEdit
    ? updateTransaction.bind(null, transaction.id)
    : createTransaction;
  const [state, formAction, isPending] = useActionState<
    TransactionActionState,
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
              <span className="sr-only">Editar transacción</span>
            </Button>
          ) : (
            <Button>
              <Plus className="size-4" />
              Nueva transacción
            </Button>
          )
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Editar transacción" : "Nueva transacción"}
          </DialogTitle>
          <DialogDescription>Registrá un ingreso o gasto.</DialogDescription>
        </DialogHeader>
        {open ? (
          <TransactionFormFields
            categories={categories}
            transaction={transaction}
            formAction={formAction}
            isPending={isPending}
            state={state}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
