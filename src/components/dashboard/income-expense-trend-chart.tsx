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
import { ChartTooltipContent } from "./chart-tooltip";
import { formatCurrency } from "@/lib/utils/format";

interface MonthlyTrendPoint {
  month: string;
  label: string;
  ingresos: number;
  gastos: number;
}

export function IncomeExpenseTrendChart({
  data,
}: {
  data: MonthlyTrendPoint[];
}) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ left: 0, right: 8, top: 4, bottom: 0 }}>
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
          width={72}
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
          dataKey="ingresos"
          name="Ingresos"
          fill="var(--positive)"
          radius={[4, 4, 0, 0]}
          maxBarSize={28}
        />
        <Bar
          dataKey="gastos"
          name="Gastos"
          fill="var(--negative)"
          radius={[4, 4, 0, 0]}
          maxBarSize={28}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
