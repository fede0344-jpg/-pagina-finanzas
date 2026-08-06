import { Card, CardContent } from "@/components/ui/card";
import { formatARS } from "@/lib/utils/format";
import type { DolarRate } from "@/lib/market-data/dolar";

export function DolarWidget({ rates }: { rates: DolarRate[] }) {
  if (rates.length === 0) return null;

  return (
    <Card>
      <CardContent className="flex flex-wrap gap-x-6 gap-y-3">
        {rates.map((rate) => (
          <div
            key={`${rate.moneda}-${rate.casa}`}
            className="flex flex-col gap-0.5"
          >
            <span className="text-xs text-muted-foreground">
              {rate.nombre}
            </span>
            <span className="text-sm font-medium tabular-nums">
              {formatARS(rate.compra)}{" "}
              <span className="text-muted-foreground">/</span>{" "}
              {formatARS(rate.venta)}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
