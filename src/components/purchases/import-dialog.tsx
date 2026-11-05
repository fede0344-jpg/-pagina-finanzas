"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
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
import { importHoldings } from "@/lib/actions/import-holdings";
import {
  CRYPTO_NAMES,
  USD_STABLE,
  monthlyInterest,
  netHoldings,
  parseNexoCsv,
  type BalanceEvent,
  type ImportedPurchase,
  type MonthlyInterest,
  type SkippedEvent,
} from "@/lib/import/nexo-csv";
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

interface Holding {
  ticker: string;
  name: string;
  quantity: number;
}

type Message = { error?: string; ok?: string } | null;

export function ImportDialog({ existing }: { existing: ExistingPurchase[] }) {
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState<Row[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [skipped, setSkipped] = useState<SkippedEvent[]>([]);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [interestRows, setInterestRows] = useState<MonthlyInterest[]>([]);
  const [interestMessage, setInterestMessage] = useState<Message>(null);
  const [message, setMessage] = useState<Message>(null);
  const [holdingsMessage, setHoldingsMessage] = useState<Message>(null);
  const [isPending, startTransition] = useTransition();

  function reset() {
    setRows([]);
    setSelected(new Set());
    setSkipped([]);
    setHoldings([]);
    setInterestRows([]);
    setMessage(null);
    setHoldingsMessage(null);
    setInterestMessage(null);
  }

  async function onFiles(files: FileList | null) {
    reset();
    if (!files || files.length === 0) return;

    const all: Row[] = [];
    const seen = new Set<string>();
    const skippedAll: SkippedEvent[] = [];
    const balanceAll: BalanceEvent[] = [];

    try {
      for (const file of Array.from(files)) {
        const result = parseNexoCsv(await file.text());
        skippedAll.push(...result.skipped);
        balanceAll.push(...result.balance);
        for (const p of result.purchases) {
          if (seen.has(p.ref)) continue; // misma transacción en dos archivos
          seen.add(p.ref);
          const symbol = normalizeCryptoSymbol(p.ticker);
          all.push({
            ...p,
            key: p.ref,
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
    setSkipped(skippedAll);

    // Intereses por mes (el mes en curso, en hora argentina, queda afuera).
    const currentMonth = new Date(Date.now() - 3 * 3_600_000)
      .toISOString()
      .slice(0, 7);
    setInterestRows(monthlyInterest(skippedAll, currentMonth));

    // Tenencias: lo que queda en la cuenta, sin dólares (esos son efectivo).
    const net = netHoldings(balanceAll);
    setHoldings(
      Object.entries(net)
        .filter(([ticker, qty]) => !USD_STABLE.has(ticker) && qty > 0)
        .map(([ticker, quantity]) => ({
          ticker,
          name: CRYPTO_NAMES[ticker] ?? ticker,
          quantity,
        }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    );

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

  function confirmPurchases() {
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

  function confirmInterest() {
    startTransition(async () => {
      const result = await importPurchases(
        interestRows.map(({ ticker, name, date, invested, quantity }) => ({
          ticker,
          name,
          date,
          invested,
          quantity,
        })),
      );
      if ("error" in result) {
        setInterestMessage({ error: result.error });
        return;
      }
      setInterestMessage({
        ok:
          `Se cargaron ${result.inserted} compras de intereses.` +
          (result.skipped > 0 ? ` ${result.skipped} ya estaban.` : ""),
      });
    });
  }

  function confirmHoldings() {
    startTransition(async () => {
      const result = await importHoldings(holdings, "Nexo");
      if ("error" in result) {
        setHoldingsMessage({ error: result.error });
        return;
      }
      setHoldingsMessage({
        ok: `Listo: ${result.created} activos nuevos y ${result.updated} actualizados en tu Portafolio.`,
      });
    });
  }

  const chosenCount = rows.filter((r) => selected.has(r.key)).length;
  const totalInvested = rows
    .filter((r) => selected.has(r.key))
    .reduce((sum, r) => sum + r.invested, 0);

  // Resumen de lo que no se carga como compra (sin repetir transacciones).
  const skippedUnique = new Map(skipped.map((s) => [s.ref, s]));
  const skippedCount: Record<string, number> = {};
  const interest: Record<string, number> = {};
  for (const s of skippedUnique.values()) {
    skippedCount[s.label] = (skippedCount[s.label] ?? 0) + 1;
    if (s.interest) {
      interest[s.interest.currency] =
        (interest[s.interest.currency] ?? 0) + s.interest.amount;
    }
  }
  const skippedEntries = Object.entries(skippedCount);

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
          <DialogTitle>Importar desde Nexo</DialogTitle>
          <DialogDescription>
            Subí el archivo CSV de Nexo (Transacciones → Exportar, con todos
            los activos). Se lee acá mismo, en tu navegador: recién se guarda
            algo cuando confirmás.
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
              <strong>Compras:</strong> encontramos {rows.length} cambios de
              dólares (USDT/USDC) por cripto. Tildá las que quieras cargar.
            </p>
            <ul className="flex max-h-56 flex-col divide-y divide-foreground/8 overflow-y-auto rounded-2xl bg-card ring-1 ring-foreground/8">
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
            <Button
              type="button"
              onClick={confirmPurchases}
              disabled={isPending || chosenCount === 0}
            >
              {isPending
                ? "Cargando..."
                : `Cargar ${chosenCount} ${chosenCount === 1 ? "compra" : "compras"} (${formatUSD(totalInvested)})`}
            </Button>
          </div>
        ) : null}

        {interestRows.length > 0 ? (
          <div className="flex flex-col gap-3 rounded-2xl bg-muted p-4">
            <p className="text-sm">
              <strong>Intereses ganados:</strong> {interestRows.length} cargas
              mensuales, una por activo y mes, valuadas al precio en dólares
              del día que cobraste:
            </p>
            <ul className="flex flex-col gap-1 font-mono text-sm">
              {Object.entries(
                interestRows.reduce<Record<string, { q: number; usd: number }>>(
                  (acc, r) => {
                    const a = (acc[r.ticker] ??= { q: 0, usd: 0 });
                    a.q += r.quantity;
                    a.usd += r.invested;
                    return acc;
                  },
                  {},
                ),
              ).map(([ticker, t]) => (
                <li key={ticker} className="flex justify-between gap-3">
                  <span>{CRYPTO_NAMES[ticker] ?? ticker}</span>
                  <span className="font-bold">
                    <Money>
                      {formatQuantity(t.q)} {ticker} · {formatUSD(t.usd)}
                    </Money>
                  </span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-muted-foreground">
              No incluye el mes en curso (se suma cuando termine) ni los
              intereses en dólares (USDT/USDC), que no tienen precio de
              compra.
            </p>
            {interestMessage?.error ? (
              <p role="alert" className="text-sm text-negative">
                {interestMessage.error}
              </p>
            ) : null}
            {interestMessage?.ok ? (
              <p role="status" className="text-sm font-semibold text-positive">
                {interestMessage.ok}
              </p>
            ) : null}
            <Button
              type="button"
              variant="secondary"
              onClick={confirmInterest}
              disabled={isPending}
            >
              {isPending ? "Cargando..." : "Cargar intereses como compras"}
            </Button>
          </div>
        ) : null}

        {holdings.length > 0 ? (
          <div className="flex flex-col gap-3 rounded-2xl bg-muted p-4">
            <p className="text-sm">
              <strong>Lo que tenés hoy en la cuenta</strong> (depósitos,
              compras, intereses y retiros, sumados):
            </p>
            <ul className="flex flex-col gap-1 font-mono text-sm">
              {holdings.map((h) => (
                <li key={h.ticker} className="flex justify-between gap-3">
                  <span>{h.name}</span>
                  <span className="font-bold">
                    <Money>{formatQuantity(h.quantity)}</Money> {h.ticker}
                  </span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-muted-foreground">
              Se cargan al Portafolio por cantidad y se valúan con el precio de
              hoy. Si volvés a importar, se actualizan en vez de repetirse.
            </p>
            {holdingsMessage?.error ? (
              <p role="alert" className="text-sm text-negative">
                {holdingsMessage.error}
              </p>
            ) : null}
            {holdingsMessage?.ok ? (
              <p role="status" className="text-sm font-semibold text-positive">
                {holdingsMessage.ok}{" "}
                <Link href="/portafolio" className="underline">
                  Ver Portafolio
                </Link>
              </p>
            ) : null}
            <Button
              type="button"
              variant="secondary"
              onClick={confirmHoldings}
              disabled={isPending}
            >
              {isPending ? "Cargando..." : "Agregar al Portafolio"}
            </Button>
          </div>
        ) : null}

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

        <DialogFooter>
          <DialogClose render={<Button type="button" variant="outline" />}>
            Cerrar
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
