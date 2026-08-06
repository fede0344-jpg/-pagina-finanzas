"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartTooltipContent } from "@/components/dashboard/chart-tooltip";
import { formatCurrency } from "@/lib/utils/format";
import type { CompoundInterestYearPoint } from "@/lib/calculators/compound-interest";

export function CompoundInterestChart({
  data,
}: {
  data: CompoundInterestYearPoint[];
}) {
  const chartData = data.map((point) => ({
    label: `Año ${point.year}`,
    aportes: point.totalContributions,
    interes: point.totalInterest,
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart
        data={chartData}
        margin={{ left: 0, right: 8, top: 4, bottom: 0 }}
      >
        <CartesianGrid vertical={false} stroke="var(--border)" />
        <XAxis
          dataKey="label"
          stroke="var(--muted-foreground)"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tickFormatter={(v) => formatCurrency(v)}
          stroke="var(--muted-foreground)"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          width={80}
        />
        <Tooltip
          cursor={{ fill: "var(--muted)" }}
          content={ChartTooltipContent}
        />
        <Legend
          formatter={(value) => (
            <span className="text-sm text-muted-foreground">{value}</span>
          )}
        />
        <Bar
          dataKey="aportes"
          name="Aportes"
          stackId="total"
          fill="var(--primary)"
          maxBarSize={28}
        />
        <Bar
          dataKey="interes"
          name="Interés generado"
          stackId="total"
          fill="var(--positive)"
          radius={[4, 4, 0, 0]}
          maxBarSize={28}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
