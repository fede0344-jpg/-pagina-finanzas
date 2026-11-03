"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";
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
  createPurchase,
  type PurchaseActionState,
} from "@/lib/actions/purchases";
import type { Asset } from "@/lib/types/domain";
import type { AssetType } from "@/lib/types/database.types";

const ASSET_TYPES: { value: AssetType; label: string; placeholder: string }[] = [
  { value: "crypto", label: "Cripto", placeholder: "ej: BTC, ETH, solana" },
  { value: "cedear", label: "CEDEAR", placeholder: "ej: AAPL, TSLA" },
  { value: "accion_arg", label: "Acción arg.", placeholder: "ej: GGAL, YPFD" },
  { value: "bono_arg", label: "Bono arg.", placeholder: "ej: AL30, GD30" },
];

function todayIso() {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}

export function PurchaseFormDialog({
  assets,
  label = "Nueva compra",
}: {
  assets: Asset[];
  label?: string;
}) {
  const [state, formAction, isPending] = useActionState<
    PurchaseActionState,
    FormData
  >(createPurchase, null);
  const [open, setOpen] = useState(false);
  const wasPending = useRef(false);

  const [assetType, setAssetType] = useState<AssetType>("crypto");
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");

  const activeType = ASSET_TYPES.find((t) => t.value === assetType)!;
  const currencyLabel = assetType === "crypto" ? "dólares (USD)" : "pesos (ARS)";

  useEffect(() => {
    if (wasPending.current && !isPending && !state) {
      setOpen(false);
      setName("");
      setSymbol("");
    }
    wasPending.current = isPending;
  }, [isPending, state]);

  function pick(asset: Asset) {
    setAssetType(asset.asset_type);
    setName(asset.name);
    setSymbol(asset.symbol);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button>
            <Plus className="size-4" />
            {label}
          </Button>
        }
      />
      <DialogContent className="max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cargar una compra</DialogTitle>
          <DialogDescription>
            Anotá qué compraste, cuándo y cuánto. Después te mostramos cómo va
            ese dinero con el precio de hoy.
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="flex flex-col gap-4">
          {assets.length > 0 ? (
            <div className="flex flex-col gap-2">
              <Label>Elegir de mis activos</Label>
              <div className="flex flex-wrap gap-2">
                {assets.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => pick(a)}
                    className="rounded-full bg-card px-3 py-1.5 text-xs font-bold ring-1 ring-foreground/10 transition-colors hover:bg-muted"
                  >
                    {a.name}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

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
              <Label htmlFor="purchase-name">Nombre</Label>
              <Input
                id="purchase-name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={60}
                placeholder="ej: Bitcoin"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="purchase-symbol">Símbolo</Label>
              <Input
                id="purchase-symbol"
                name="symbol"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                maxLength={20}
                placeholder={activeType.placeholder}
                required
              />
            </div>
          </div>
          <p className="-mt-2 text-xs text-muted-foreground">
            {assetType === "crypto"
              ? "En cripto podés escribir el ticker (BTC, ETH, SOL…) o el id de CoinGecko (bitcoin)."
              : "Usá el ticker tal cual cotiza en BYMA."}
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="purchase-date">Fecha de la compra</Label>
              <Input
                id="purchase-date"
                name="purchase_date"
                type="date"
                max={todayIso()}
                defaultValue={todayIso()}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="purchase-invested">
                Monto invertido
              </Label>
              <Input
                id="purchase-invested"
                name="invested"
                inputMode="decimal"
                placeholder="ej: 1000 o 1.500,50"
                required
              />
            </div>
          </div>
          <p className="-mt-2 text-xs text-muted-foreground">
            El monto va en {currencyLabel}, que es la moneda en la que cotiza
            este tipo de activo.
          </p>

          <div className="flex flex-col gap-2">
            <Label htmlFor="purchase-price">Precio de compra (opcional)</Label>
            <Input
              id="purchase-price"
              name="buy_price"
              inputMode="decimal"
              placeholder="Si lo dejás vacío, lo buscamos según la fecha"
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
              {isPending ? "Buscando precio..." : "Guardar compra"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
