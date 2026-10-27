import type { TooltipContentProps } from "recharts";
import { formatCurrency } from "@/lib/utils/format";

export function ChartTooltipContent({
  active,
  payload,
  label,
}: TooltipContentProps) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="rounded-xl border bg-popover px-3 py-2 text-sm shadow-md">
      {label ? (
        <p className="mb-1 text-xs text-muted-foreground">{label}</p>
      ) : null}
      <div className="flex flex-col gap-1">
        {payload.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <span
              className="h-0.5 w-3 shrink-0 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-muted-foreground">{item.name}</span>
            <span className="ml-auto font-medium tabular-nums">
              {formatCurrency(Number(item.value ?? 0))}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
