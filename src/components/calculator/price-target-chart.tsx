"use client";

import { useId } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartTooltipContent } from "@/components/dashboard/chart-tooltip";
import { formatCurrency } from "@/lib/utils/format";
import type { PriceTargetYearPoint } from "@/lib/calculators/price-target";

export function PriceTargetChart({ data }: { data: PriceTargetYearPoint[] }) {
  const gradientId = useId();
  const chartData = data.map((point) => ({
    label: point.year === 0 ? "Hoy" : `Año ${point.year}`,
    value: point.value,
  }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart
        data={chartData}
        margin={{ left: 0, right: 8, top: 4, bottom: 0 }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.2} />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="var(--border)" />
        <XAxis
          dataKey="label"
          stroke="var(--muted-foreground)"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tickFormatter={(v) => formatCurrency(v)}
          stroke="var(--muted-foreground)"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          width={80}
        />
        <Tooltip cursor={{ stroke: "var(--border)" }} content={ChartTooltipContent} />
        <Area
          type="monotone"
          dataKey="value"
          name="Valor proyectado"
          stroke="var(--primary)"
          strokeWidth={2}
          fill={`url(#${gradientId})`}
          dot={false}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
