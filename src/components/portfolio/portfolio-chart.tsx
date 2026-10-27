"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { TooltipContentProps } from "recharts";
import { Money } from "@/components/privacy/money";
import {
  formatMoney,
  formatPercent,
  type PortfolioSlice,
} from "@/lib/portfolio/aggregate";
import type { PortfolioCurrency } from "@/lib/types/database.types";

type TooltipSlice = PortfolioSlice & { currency: PortfolioCurrency };

function SliceTooltip({ active, payload }: TooltipContentProps) {
  if (!active || !payload || payload.length === 0) return null;
  const slice = payload[0].payload as TooltipSlice;
  return (
    <div className="rounded-xl border bg-popover px-3 py-2 text-sm shadow-md">
      <div className="flex items-center gap-2">
        <span
          className="size-2.5 rounded-full"
          style={{ backgroundColor: slice.color }}
        />
        <span className="font-medium">{slice.position.name}</span>
      </div>
      <p className="mt-1 tabular-nums text-muted-foreground">
        <Money>{formatMoney(slice.value, slice.currency)}</Money> ·{" "}
        <span className="font-medium text-foreground">
          {formatPercent(slice.percent)}
        </span>
      </p>
    </div>
  );
}

export function PortfolioChart({
  slices,
  total,
  currency,
  hovered,
  onHover,
}: {
  slices: PortfolioSlice[];
  total: number;
  currency: PortfolioCurrency;
  hovered: string | null;
  onHover: (id: string | null) => void;
}) {
  const data: TooltipSlice[] = slices.map((slice) => ({ ...slice, currency }));

  return (
    <div className="relative mx-auto aspect-square w-full max-w-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip content={SliceTooltip} />
          <Pie
            data={data}
            dataKey="value"
            innerRadius="64%"
            outerRadius="96%"
            paddingAngle={slices.length > 1 ? 2 : 0}
            cornerRadius={4}
            stroke="none"
            animationDuration={600}
            onMouseLeave={() => onHover(null)}
          >
            {data.map((slice) => (
              <Cell
                key={slice.position.id}
                fill={slice.color}
                fillOpacity={
                  hovered === null || hovered === slice.position.id ? 1 : 0.3
                }
                onMouseEnter={() => onHover(slice.position.id)}
                style={{ transition: "fill-opacity 150ms" }}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="eyebrow text-muted-foreground">Total</span>
        <span className="display num text-2xl">
          <Money>{formatMoney(total, currency)}</Money>
        </span>
      </div>
    </div>
  );
}
