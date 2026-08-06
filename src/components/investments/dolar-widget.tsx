import { DollarSign, Euro } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatARS } from "@/lib/utils/format";
import type { DolarRate } from "@/lib/market-data/dolar";

function CurrencyRow({
  label,
  icon,
  rates,
}: {
  label: string;
  icon: React.ReactNode;
  rates: DolarRate[];
}) {
  if (rates.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground sm:w-16 sm:shrink-0">
        {icon}
        {label}
      </div>
      <div className="flex flex-1 flex-wrap gap-x-6 gap-y-3">
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
      </div>
    </div>
  );
}

export function DolarWidget({ rates }: { rates: DolarRate[] }) {
  if (rates.length === 0) return null;

  const usdRates = rates.filter((rate) => rate.moneda === "USD");
  const eurRates = rates.filter((rate) => rate.moneda === "EUR");

  return (
    <Card>
      <CardContent className="flex flex-col gap-4">
        <CurrencyRow
          label="Dólar"
          icon={<DollarSign className="size-3.5" />}
          rates={usdRates}
        />
        {usdRates.length > 0 && eurRates.length > 0 ? (
          <div className="h-px bg-border" />
        ) : null}
        <CurrencyRow
          label="Euro"
          icon={<Euro className="size-3.5" />}
          rates={eurRates}
        />
      </CardContent>
    </Card>
  );
}
