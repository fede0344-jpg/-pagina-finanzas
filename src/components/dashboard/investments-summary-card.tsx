import Link from "next/link";
import { ArrowRight, TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Asset } from "@/lib/types/domain";
import type { AssetMarketData } from "@/lib/market-data/types";

function ChangeRow({
  asset,
  changePercent,
  label,
}: {
  asset: Asset;
  changePercent: number;
  label: string;
}) {
  const positive = changePercent >= 0;
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 rounded-2xl px-4 py-3",
        positive ? "bg-positive/12" : "bg-negative/12",
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        {positive ? (
          <TrendingUp className="size-4 shrink-0 text-positive" />
        ) : (
          <TrendingDown className="size-4 shrink-0 text-negative" />
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-bold">{asset.name}</p>
          <p className="font-mono text-[11px] text-muted-foreground">{label}</p>
        </div>
      </div>
      <span
        className={cn(
          "shrink-0 text-sm font-bold tabular-nums",
          positive ? "text-positive" : "text-negative",
        )}
      >
        {positive ? "+" : ""}
        {changePercent.toFixed(2)}%
      </span>
    </div>
  );
}

export function InvestmentsSummaryCard({
  items,
}: {
  items: { asset: Asset; data: AssetMarketData }[];
}) {
  const withQuote = items.filter(
    (
      item,
    ): item is {
      asset: Asset;
      data: AssetMarketData & {
        quote: NonNullable<AssetMarketData["quote"]>;
      };
    } => item.data.quote !== null,
  );

  const counts = { bajo: 0, medio: 0, alto: 0 };
  for (const item of items) counts[item.asset.risk_level]++;

  const sorted = [...withQuote].sort(
    (a, b) => b.data.quote.changePercent - a.data.quote.changePercent,
  );
  const best = sorted[0];
  const worst = sorted[sorted.length - 1];

  return (
    <section
      className="tile tile-sol tilt flex flex-col justify-between gap-5 lg:col-span-5"
      style={{ "--i": 7 } as React.CSSProperties}
    >
      <div className="flex flex-col gap-2">
        <span className="eyebrow">Inversiones</span>
        {withQuote.length === 0 ? (
          <p className="text-sm">Todavía no tenés activos cargados.</p>
        ) : (
          <p className="font-mono text-xs opacity-70">
            {counts.bajo} riesgo bajo · {counts.medio} medio · {counts.alto} alto
          </p>
        )}
      </div>

      {withQuote.length > 0 ? (
        <div className="flex flex-col gap-2">
          <ChangeRow
            asset={best.asset}
            changePercent={best.data.quote.changePercent}
            label="Mejor del día"
          />
          {worst.asset.id !== best.asset.id ? (
            <ChangeRow
              asset={worst.asset}
              changePercent={worst.data.quote.changePercent}
              label="Peor del día"
            />
          ) : null}
        </div>
      ) : null}

      <Link
        href="/inversiones"
        className="group inline-flex w-fit items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm font-bold text-on-ink"
      >
        Ver mis inversiones
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </section>
  );
}
