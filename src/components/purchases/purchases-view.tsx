import { LineChart } from "lucide-react";
import { Money } from "@/components/privacy/money";
import { Odometer } from "@/components/dashboard/odometer";
import { PurchaseFormDialog } from "./purchase-form-dialog";
import { DeletePurchaseButton } from "./delete-purchase-button";
import { formatARS, formatDate, formatSignedPercent, formatUSD } from "@/lib/utils/format";
import { cn } from "@/lib/utils";
import type {
  AssetGroup,
  CurrencyTotals,
  PurchaseCurrency,
} from "@/lib/purchases/aggregate";
import type { Asset } from "@/lib/types/domain";

function money(amount: number, currency: PurchaseCurrency) {
  return currency === "USD" ? formatUSD(amount) : formatARS(amount);
}

function signedMoney(amount: number, currency: PurchaseCurrency) {
  return `${amount > 0 ? "+" : ""}${money(amount, currency)}`;
}

function formatQuantity(quantity: number) {
  return quantity.toLocaleString("es-AR", { maximumSignificantDigits: 6 });
}

function gainTone(value: number | null) {
  if (value === null) return "text-muted-foreground";
  return value >= 0 ? "text-positive" : "text-negative";
}

function SummaryRow({ totals, index }: { totals: CurrencyTotals; index: number }) {
  const { currency, invested, currentValue, gain, gainPercent } = totals;
  const label = currency === "USD" ? "dólares" : "pesos";

  return (
    <div className="grid gap-4 lg:grid-cols-12">
      <section
        className={cn(
          "tile tile-cq tilt flex min-h-52 flex-col justify-between gap-6 lg:col-span-6",
          gain >= 0 ? "tile-cel" : "tile-ink",
        )}
        style={{ "--i": index * 3 } as React.CSSProperties}
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="eyebrow">Resultado en {label}</span>
          <span className="rounded-full bg-[color-mix(in_srgb,currentColor_16%,transparent)] px-2.5 py-1 text-xs font-bold">
            {formatSignedPercent(gainPercent)}
          </span>
        </div>
        <Money mask={<Odometer text="••••••" />}>
          <Odometer text={signedMoney(gain, currency)} />
        </Money>
      </section>

      <section
        className="tile tilt flex min-h-40 flex-col justify-between gap-4 lg:col-span-3"
        style={{ "--i": index * 3 + 1 } as React.CSSProperties}
      >
        <span className="eyebrow text-muted-foreground">Invertido</span>
        <p className="display num text-2xl leading-none">
          <Money>{money(invested, currency)}</Money>
        </p>
      </section>

      <section
        className="tile tile-sol tilt flex min-h-40 flex-col justify-between gap-4 lg:col-span-3"
        style={{ "--i": index * 3 + 2 } as React.CSSProperties}
      >
        <span className="eyebrow">Vale hoy</span>
        <p className="display num text-2xl leading-none">
          <Money>{money(currentValue, currency)}</Money>
        </p>
      </section>
    </div>
  );
}

function GroupTile({ group, index }: { group: AssetGroup; index: number }) {
  const { currency } = group;

  return (
    <section
      className="tile flex flex-col gap-5"
      style={{ "--i": index } as React.CSSProperties}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="display text-2xl leading-tight">{group.name}</h3>
          <p className="font-mono text-xs text-muted-foreground uppercase">
            {group.symbol}
            {group.price !== null
              ? ` · hoy ${money(group.price, currency)}`
              : " · sin cotización"}
          </p>
        </div>
        {group.gainPercent !== null ? (
          <span
            className={cn(
              "display num rounded-full px-3 py-1.5 text-lg",
              group.gainPercent >= 0
                ? "bg-positive/12 text-positive"
                : "bg-negative/12 text-negative",
            )}
          >
            {formatSignedPercent(group.gainPercent)}
          </span>
        ) : null}
      </div>

      <dl className="grid grid-cols-3 gap-3">
        <div>
          <dt className="eyebrow text-muted-foreground">Invertido</dt>
          <dd className="mt-1 text-sm font-bold tabular-nums">
            <Money>{money(group.invested, currency)}</Money>
          </dd>
        </div>
        <div>
          <dt className="eyebrow text-muted-foreground">Vale hoy</dt>
          <dd className="mt-1 text-sm font-bold tabular-nums">
            {group.currentValue !== null ? (
              <Money>{money(group.currentValue, currency)}</Money>
            ) : (
              "—"
            )}
          </dd>
        </div>
        <div>
          <dt className="eyebrow text-muted-foreground">Resultado</dt>
          <dd
            className={cn(
              "mt-1 text-sm font-bold tabular-nums",
              gainTone(group.gain),
            )}
          >
            {group.gain !== null ? (
              <Money>{signedMoney(group.gain, currency)}</Money>
            ) : (
              "—"
            )}
          </dd>
        </div>
      </dl>

      <ul className="flex flex-col divide-y divide-foreground/8 border-t border-foreground/8">
        {group.purchases.map(({ purchase, gain, gainPercent }) => (
          <li
            key={purchase.id}
            className="flex flex-wrap items-center gap-x-4 gap-y-1 py-3 text-sm"
          >
            <span className="w-24 shrink-0 font-mono text-xs text-muted-foreground">
              {formatDate(purchase.purchase_date)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-semibold tabular-nums">
                <Money>{money(purchase.invested, currency)}</Money>
              </p>
              <p className="font-mono text-xs text-muted-foreground">
                a {money(purchase.buy_price, currency)} ·{" "}
                <Money>{formatQuantity(purchase.quantity)}</Money>{" "}
                {group.symbol.toUpperCase()}
              </p>
            </div>
            <span
              className={cn(
                "shrink-0 text-right font-bold tabular-nums",
                gainTone(gainPercent),
              )}
            >
              {gainPercent !== null ? formatSignedPercent(gainPercent) : "—"}
              {gain !== null ? (
                <span className="block font-mono text-xs font-medium">
                  <Money>{signedMoney(gain, currency)}</Money>
                </span>
              ) : null}
            </span>
            <DeletePurchaseButton
              purchaseId={purchase.id}
              label={group.name}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

export function PurchasesView({
  groups,
  totals,
  withoutPrice,
  assets,
}: {
  groups: AssetGroup[];
  totals: CurrencyTotals[];
  withoutPrice: AssetGroup[];
  assets: Asset[];
}) {
  if (groups.length === 0) {
    return (
      <section className="tile flex flex-col items-center gap-4 py-14 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-cel text-on-cel">
          <LineChart className="size-7" />
        </div>
        <div className="flex flex-col gap-1">
          <p className="display text-2xl">Todavía no cargaste ninguna compra</p>
          <p className="max-w-md text-sm text-muted-foreground">
            Anotá qué compraste, en qué fecha y cuánto. Por ejemplo: 1.000
            dólares en Bitcoin el 2 de noviembre. Nosotros buscamos el precio
            de ese día y te mostramos cuánto ganás o perdés hoy.
          </p>
        </div>
        <PurchaseFormDialog assets={assets} label="Cargar mi primera compra" />
      </section>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {totals.map((t, i) => (
        <SummaryRow key={t.currency} totals={t} index={i} />
      ))}

      {withoutPrice.length > 0 ? (
        <p className="rounded-2xl bg-card px-4 py-3 text-sm text-muted-foreground ring-1 ring-foreground/8">
          No pudimos traer el precio actual de{" "}
          {withoutPrice.map((g) => g.name).join(", ")}, así que no entra en los
          totales. Probá de nuevo en un rato.
        </p>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        {groups.map((group, i) => (
          <GroupTile key={group.key} group={group} index={i} />
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        El rendimiento compara lo que invertiste con el precio de hoy. Cripto
        se mide en dólares; CEDEARs, acciones y bonos, en pesos. No incluye
        comisiones ni impuestos y no es asesoramiento financiero.
      </p>
    </div>
  );
}
