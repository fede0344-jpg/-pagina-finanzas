import Link from "next/link";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Asset } from "@/lib/types/domain";
import type { AssetMarketData } from "@/lib/market-data/types";

function ChangeRow({
  asset,
  changePercent,
  positive,
}: {
  asset: Asset;
  changePercent: number;
  positive: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-md px-3 py-2",
        positive ? "bg-positive/10" : "bg-negative/10",
      )}
    >
      <div className="flex items-center gap-2">
        {positive ? (
          <TrendingUp className="size-4 text-positive" />
        ) : (
          <TrendingDown className="size-4 text-negative" />
        )}
        <span className="text-sm font-medium">{asset.name}</span>
      </div>
      <span
        className={cn(
          "text-sm font-medium tabular-nums",
          positive ? "text-positive" : "text-negative",
        )}
      >
        {changePercent >= 0 ? "+" : ""}
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
    (item): item is { asset: Asset; data: AssetMarketData & { quote: NonNullable<AssetMarketData["quote"]> } } =>
      item.data.quote !== null,
  );

  const counts = { bajo: 0, medio: 0, alto: 0 };
  for (const item of items) counts[item.asset.risk_level]++;

  if (withQuote.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Inversiones</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">
            Todavía no tenés activos cargados.
          </p>
          <Link
            href="/inversiones"
            className="w-fit text-sm text-primary underline underline-offset-4"
          >
            Ir a Inversiones
          </Link>
        </CardContent>
      </Card>
    );
  }

  const sorted = [...withQuote].sort(
    (a, b) => b.data.quote.changePercent - a.data.quote.changePercent,
  );
  const best = sorted[0];
  const worst = sorted[sorted.length - 1];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Inversiones</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">
          {counts.bajo} riesgo bajo · {counts.medio} riesgo medio · {counts.alto}{" "}
          riesgo alto
        </p>
        <div className="flex flex-col gap-2">
          <ChangeRow
            asset={best.asset}
            changePercent={best.data.quote.changePercent}
            positive={best.data.quote.changePercent >= 0}
          />
          {worst.asset.id !== best.asset.id ? (
            <ChangeRow
              asset={worst.asset}
              changePercent={worst.data.quote.changePercent}
              positive={worst.data.quote.changePercent >= 0}
            />
          ) : null}
        </div>
        <Link
          href="/inversiones"
          className="w-fit text-sm text-primary underline underline-offset-4"
        >
          Ver todas mis inversiones
        </Link>
      </CardContent>
    </Card>
  );
}
