import { formatCurrency } from "@/lib/utils/format";

interface ExpenseByCategory {
  id: string;
  name: string;
  color: string;
  amount: number;
}

export function ExpenseCategoryBreakdown({
  data,
}: {
  data: ExpenseByCategory[];
}) {
  if (data.length === 0) return null;

  const total = data.reduce((sum, d) => sum + d.amount, 0);

  return (
    <ul className="flex flex-col gap-2 border-t pt-3">
      {data.map((d) => {
        const pct = total > 0 ? (d.amount / total) * 100 : 0;
        return (
          <li key={d.id} className="flex items-center gap-2 text-sm">
            <span
              className="size-2 shrink-0 rounded-full"
              style={{ backgroundColor: d.color }}
            />
            <span className="flex-1 truncate">{d.name}</span>
            <span className="w-10 text-right text-xs text-muted-foreground tabular-nums">
              {pct.toFixed(0)}%
            </span>
            <span className="w-24 text-right font-medium tabular-nums">
              {formatCurrency(d.amount)}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
