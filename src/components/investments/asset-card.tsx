"use client";

import { useState, useTransition } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { AssetChart } from "./asset-chart";
import { AssetFormDialog } from "./asset-form-dialog";
import { DeleteAssetButton } from "./delete-asset-button";
import { getAssetHistoryForRange } from "@/lib/actions/assets";
import { calculatePeriodReturn } from "@/lib/market-data/calculate";
import { formatCurrency, formatARS } from "@/lib/utils/format";
import { cn } from "@/lib/utils";
import { HISTORY_RANGES } from "@/lib/market-data/types";
import type { Asset } from "@/lib/types/domain";
import type { AssetMarketData, HistoryRange } from "@/lib/market-data/types";

export function AssetCard({
  asset,
  data,
}: {
  asset: Asset;
  data: AssetMarketData;
}) {
  const [range, setRange] = useState<HistoryRange>("1A");
  const [series, setSeries] = useState(data.series);
  const [isPending, startTransition] = useTransition();

  const formatPrice =
    asset.asset_type === "crypto" ? formatCurrency : formatARS;
  const periodReturn = calculatePeriodReturn(series);
  const isPositive = (periodReturn ?? data.quote?.changePercent ?? 0) >= 0;
  const rangeLabel = HISTORY_RANGES.find((r) => r.value === range)?.label;

  function handleRangeChange(newRange: HistoryRange) {
    setRange(newRange);
    startTransition(async () => {
      const fresh = await getAssetHistoryForRange(
        { asset_type: asset.asset_type, symbol: asset.symbol },
        newRange,
      );
      setSeries(fresh);
    });
  }

  return (
    <Card>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-medium">{asset.name}</p>
            <p className="text-xs text-muted-foreground uppercase">
              {asset.symbol}
            </p>
          </div>
          <div className="flex gap-1">
            <AssetFormDialog asset={asset} />
            <DeleteAssetButton assetId={asset.id} assetName={asset.name} />
          </div>
        </div>

        {data.quote ? (
          <>
            <div className="flex items-end justify-between gap-2">
              <span className="text-xl font-semibold tabular-nums">
                {formatPrice(data.quote.price)}
              </span>
              <div className="flex flex-col items-end gap-0.5">
                {periodReturn !== null ? (
                  <span
                    className={cn(
                      "flex items-center gap-1 text-sm font-medium tabular-nums",
                      isPositive ? "text-positive" : "text-negative",
                    )}
                  >
                    {isPositive ? (
                      <TrendingUp className="size-3.5" />
                    ) : (
                      <TrendingDown className="size-3.5" />
                    )}
                    {periodReturn >= 0 ? "+" : ""}
                    {periodReturn.toFixed(2)}% ({rangeLabel})
                  </span>
                ) : null}
                <span
                  className={cn(
                    "text-xs tabular-nums",
                    data.quote.changePercent >= 0
                      ? "text-positive"
                      : "text-negative",
                  )}
                >
                  {data.quote.changePercent >= 0 ? "+" : ""}
                  {data.quote.changePercent.toFixed(2)}% hoy
                </span>
              </div>
            </div>

            <div className={cn(isPending && "opacity-50 transition-opacity")}>
              <AssetChart series={series} positive={isPositive} />
            </div>

            <div className="flex justify-end gap-1">
              {HISTORY_RANGES.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => handleRangeChange(r.value)}
                  disabled={isPending}
                  className={cn(
                    "rounded px-1.5 py-0.5 text-[11px] font-medium",
                    range === r.value
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </>
        ) : (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No se pudo obtener la cotización.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
