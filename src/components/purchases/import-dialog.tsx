"use client";

import { useState, useTransition } from "react";
import { Upload } from "lucide-react";
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
import { Money } from "@/components/privacy/money";
import { importPurchases } from "@/lib/actions/import-purchases";
import { parseNexoCsv, type ImportedPurchase } from "@/lib/import/nexo-csv";
import { normalizeCryptoSymbol } from "@/lib/market-data/crypto-ids";
import { formatQuantity } from "@/lib/portfolio/aggregate";
import { formatDate, formatUSD } from "@/lib/utils/format";

export interface ExistingPurchase {
  symbol: string;
  date: string;
  invested: number;
}

interface Row extends ImportedPurchase {
  key: string;
  duplicate: boolean;
}

export function ImportDialog({ existing }: { existing: ExistingPurchase[] }) {
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState<Row[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [skipped, setSkipped] = useState<Record<string, number>>({});
  const [interest, setInterest] = useState<Record<string, number>>({});
  const [message, setMessage] = useState<{ error?: string; ok?: string } | null>(
    null,
  );
  const [isPending, startTransition] = useTransition();

  function reset() {
    setRows([]);
    setSelected(new Set());
    setSkipped({});
    setInterest({});
    setMessage(null);
  }

  async function onFiles(files: FileList | null) {
    reset();
    if (!files || files.length === 0) return;

    const all: Row[] = [];
    const seen = new Set<string>();
    const skippedTotal: Record<string, number> = {};
    const interestTotal: Record<string, number> = {};

    try {
      for (const file of Array.from(files)) {
        const result = parseNexoCsv(await file.text());
        for (const [k, v] of Object.entries(result.skipped)) {
          skippedTotal[k] = (skippedTotal[k] ?? 0) + v;
        }
        for (const [k, v] of Object.entries(result.interest)) {
          interestTotal[k] = (interestTotal[k] ?? 0) + v;
        }
        for (const p of result.purchases) {
          const key = p.ref || `${p.ticker}-${p.date}-${p.invested}`;
          if (seen.has(key)) continue; // mismo archivo subido dos veces
          seen.add(key);
          const symbol = normalizeCryptoSymbol(p.ticker);
          all.push({
            ...p,
            key,
            duplicate: existing.some(
              (e) =>
                normalizeCryptoSymbol(e.symbol) === symbol &&
                e.date === p.date &&
                Math.abs(e.invested - p.invested) < 0.01,
            ),
          });
        }
      }
    } catch (e) {
      setMessage({
        error: e instanceof Error ? e.message : "No se pudo leer el archivo.",
      });
      return;
    }

    all.sort((a, b) => b.date.localeCompare(a.date));
    setRows(all);
    setSelected(new Set(all.filter((r) => !r.duplicate).map((r) => r.key)));
    setSkipped(skippedTotal);
    setInterest(interestTotal);
    if (all.length === 0) {
      setMessage({ error: "No encontramos compras en ese archivo." });
    }
  }

  function toggle(key: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function confirm() {
    const chosen = rows.filter((r) => selected.has(r.key));
    startTransition(async () => {
      const result = await importPurchases(
        chosen.map(({ ticker, name, date, invested, quantity }) => ({
          ticker,
          name,
          date,
          invested,
          quantity,
        })),
      );
      if ("error" in result) {
        setMessage({ error: result.error });
        return;
      }
      setRows([]);
      setSelected(new Set());
      setMessage({
        ok:
          `Se cargaron ${result.inserted} ${result.inserted === 1 ? "compra" : "compras"}.` +
          (result.skipped > 0 ? ` ${result.skipped} ya estaban.` : ""),
      });
    });
  }

  const chosenCount = rows.filter((r) => selected.has(r.key)).length;
  const totalInvested = rows
    .filter((r) => selected.has(r.key))
    .reduce((sum, r) => sum + r.invested, 0);
  const skippedEntries = Object.entries(skipped);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset();
      }}
    >
      <DialogTrigger
        render={
          <Button variant="outline">
            <Upload className="size-4" />
            Importar de Nexo
          </Button>
        }
      />
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Importar compras desde Nexo</DialogTitle>
          <DialogDescription>
            Subí el archivo CSV de Nexo (Transacciones → Exportar). Se lee acá
            mismo, en tu navegador: recién se guarda algo cuando confirmás.
            Podés subir más de un archivo a la vez.
          </DialogDescription>
        </DialogHeader>

        <input
          type="file"
          accept=".csv,text/csv"
          multiple
          onChange={(e) => onFiles(e.target.files)}
          className="block w-full text-sm file:mr-3 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary-foreground"
        />

        {message?.error ? (
          <p role="alert" className="text-sm text-negative">
            {message.error}
          </p>
        ) : null}
        {message?.ok ? (
          <p role="status" className="text-sm font-semibold text-positive">
            {message.ok}
          </p>
        ) : null}

        {rows.length > 0 ? (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-muted-foreground">
              Encontramos <strong>{rows.length}</strong> compras con dólares
              (USDT/USDC → cripto). Tildá las que quieras cargar.
            </p>
            <ul className="flex max-h-64 flex-col divide-y divide-foreground/8 overflow-y-auto rounded-2xl bg-card ring-1 ring-foreground/8">
              {rows.map((r) => (
                <li key={r.key}>
                  <label className="flex cursor-pointer items-center gap-3 px-3 py-2.5 text-sm">
                    <input
                      type="checkbox"
                      checked={selected.has(r.key)}
                      onChange={() => toggle(r.key)}
                      className="size-4 accent-[var(--primary)]"
                    />
                    <span className="w-20 shrink-0 font-mono text-xs text-muted-foreground">
                      {formatDate(r.date)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold">
                        {r.name}
                        {r.duplicate ? (
                          <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                            Ya cargada
                          </span>
                        ) : null}
                      </span>
                      <span className="block font-mono text-xs text-muted-foreground">
                        <Money>{formatQuantity(r.quantity)}</Money> {r.ticker}
                      </span>
                    </span>
                    <span className="shrink-0 font-bold tabular-nums">
                      <Money>{formatUSD(r.invested)}</Money>
                    </span>
                  </label>
                </li>
              ))}
            </ul>

            {skippedEntries.length > 0 ? (
              <p className="text-xs text-muted-foreground">
                No se cargan como compras:{" "}
                {skippedEntries.map(([k, v]) => `${v} ${k.toLowerCase()}`).join(", ")}
                .
                {Object.keys(interest).length > 0
                  ? ` Intereses ganados: ${Object.entries(interest)
                      .map(([k, v]) => `${formatQuantity(v)} ${k}`)
                      .join(", ")}.`
                  : ""}
              </p>
            ) : null}
          </div>
        ) : null}

        <DialogFooter>
          <DialogClose render={<Button type="button" variant="outline" />}>
            {message?.ok ? "Cerrar" : "Cancelar"}
          </DialogClose>
          {rows.length > 0 ? (
            <Button
              type="button"
              onClick={confirm}
              disabled={isPending || chosenCount === 0}
            >
              {isPending
                ? "Cargando..."
                : `Cargar ${chosenCount} ${chosenCount === 1 ? "compra" : "compras"} (${totalInvested > 0 ? formatUSD(totalInvested) : "—"})`}
            </Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
