"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { TooltipContentProps } from "recharts";
import { formatCurrency } from "@/lib/utils/format";

interface ExpenseByCategory {
  id: string;
  name: string;
  color: string;
  amount: number;
}

function CategoryTooltip({ active, payload }: TooltipContentProps) {
  if (!active || !payload || payload.length === 0) return null;
  const row = payload[0].payload as ExpenseByCategory;

  return (
    <div className="rounded-lg border bg-popover px-3 py-2 text-sm shadow-md">
      <div className="flex items-center gap-2">
        <span
          className="size-2 shrink-0 rounded-full"
          style={{ backgroundColor: row.color }}
        />
        <span className="text-muted-foreground">{row.name}</span>
        <span className="ml-4 font-medium tabular-nums">
          {formatCurrency(row.amount)}
        </span>
      </div>
    </div>
  );
}

export function ExpensesByCategoryChart({
  data,
}: {
  data: ExpenseByCategory[];
}) {
  if (data.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
        Todavía no cargaste gastos este mes.
      </div>
    );
  }

  const height = Math.max(160, data.length * 40);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ left: 0, right: 24, top: 4, bottom: 4 }}
      >
        <CartesianGrid horizontal={false} stroke="var(--border)" />
        <XAxis
          type="number"
          tickFormatter={(v) => formatCurrency(v)}
          stroke="var(--muted-foreground)"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          type="category"
          dataKey="name"
          width={110}
          stroke="var(--muted-foreground)"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip cursor={{ fill: "var(--muted)" }} content={CategoryTooltip} />
        <Bar dataKey="amount" radius={[0, 4, 4, 0]} maxBarSize={20}>
          {data.map((entry) => (
            <Cell key={entry.id} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
