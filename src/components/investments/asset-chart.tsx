"use client";

import { useId } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip } from "recharts";
import type { TooltipContentProps } from "recharts";
import { formatCurrency } from "@/lib/utils/format";
import type { MarketSeriesPoint } from "@/lib/market-data/types";

function SeriesTooltip({ active, payload }: TooltipContentProps) {
  if (!active || !payload || payload.length === 0) return null;
  const point = payload[0].payload as MarketSeriesPoint;

  return (
    <div className="rounded-xl border bg-popover px-2.5 py-1.5 text-xs shadow-md">
      <p className="text-muted-foreground">{point.date}</p>
      <p className="font-medium tabular-nums">{formatCurrency(point.close)}</p>
    </div>
  );
}

export function AssetChart({
  series,
  positive,
}: {
  series: MarketSeriesPoint[];
  positive: boolean;
}) {
  const gradientId = useId();

  if (series.length < 2) {
    return (
      <div className="flex h-20 items-center justify-center text-xs text-muted-foreground">
        Sin datos históricos suficientes.
      </div>
    );
  }

  const color = positive ? "var(--positive)" : "var(--negative)";

  return (
    <ResponsiveContainer width="100%" height={80}>
      <AreaChart
        data={series}
        margin={{ top: 4, right: 0, bottom: 0, left: 0 }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.15} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Tooltip content={SeriesTooltip} cursor={{ stroke: "var(--border)" }} />
        <Area
          type="monotone"
          dataKey="close"
          stroke={color}
          strokeWidth={2}
          fill={`url(#${gradientId})`}
          dot={false}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
