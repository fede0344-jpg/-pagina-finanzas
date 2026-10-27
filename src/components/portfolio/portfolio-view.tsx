"use client";

import { useMemo, useState } from "react";
import { PieChart as PieChartIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { PortfolioChart } from "./portfolio-chart";
import { PositionFormDialog } from "./position-form-dialog";
import { DeletePositionButton } from "./delete-position-button";
import {
  buildPortfolio,
  formatMoney,
  formatPercent,
  needsUsdRate,
} from "@/lib/portfolio/aggregate";
import { cn } from "@/lib/utils";
import type { PortfolioCurrency } from "@/lib/types/database.types";
import type { PortfolioPosition } from "@/lib/types/domain";

const CURRENCY_OPTIONS: { value: PortfolioCurrency; label: string }[] = [
  { value: "USD", label: "En dólares" },
  { value: "ARS", label: "En pesos" },
];

export function PortfolioView({
  positions,
  usdRate,
}: {
  positions: PortfolioPosition[];
  usdRate: number | null;
}) {
  const [currency, setCurrency] = useState<PortfolioCurrency>("USD");
  const [hovered, setHovered] = useState<string | null>(null);

  const missingRate = needsUsdRate(positions) && !usdRate;
  const { slices, total } = useMemo(
    () => buildPortfolio(positions, currency, usdRate),
    [positions, currency, usdRate],
  );

  if (positions.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-14 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
            <PieChartIcon className="size-6 text-primary" />
          </div>
          <div className="flex flex-col gap-1">
            <p className="font-medium">Todavía no cargaste ningún activo</p>
            <p className="max-w-sm text-sm text-muted-foreground">
              Agregá cuánto tenés en cada uno (Bitcoin, plazo fijo, acciones…)
              y armamos la torta con los porcentajes.
            </p>
          </div>
          <PositionFormDialog />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex overflow-hidden rounded-md border text-sm">
          {CURRENCY_OPTIONS.map((option, i) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setCurrency(option.value)}
              className={cn(
                "px-3 py-1.5",
                i > 0 && "border-l",
                currency === option.value
                  ? "bg-primary/10 font-medium text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
        <PositionFormDialog />
      </div>

      {missingRate ? (
        <Card>
          <CardContent className="text-sm text-negative">
            No pudimos obtener la cotización del dólar para convertir tus
            activos en pesos y en dólares. Probá de nuevo en un rato.
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="grid items-center gap-8 md:grid-cols-[18rem_1fr]">
            <PortfolioChart
              slices={slices}
              total={total}
              currency={currency}
              hovered={hovered}
              onHover={setHovered}
            />

            <ul className="flex flex-col">
              {slices.map((slice) => (
                <li
                  key={slice.position.id}
                  onMouseEnter={() => setHovered(slice.position.id)}
                  onMouseLeave={() => setHovered(null)}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-2 py-2.5 transition-colors",
                    hovered === slice.position.id && "bg-muted",
                  )}
                >
                  <span
                    className="size-3 shrink-0 rounded-full"
                    style={{ backgroundColor: slice.color }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">
                      {slice.position.name}
                    </p>
                    <p className="text-xs text-muted-foreground tabular-nums">
                      {formatMoney(
                        slice.position.amount,
                        slice.position.currency,
                      )}
                      {slice.position.currency !== currency
                        ? ` ≈ ${formatMoney(slice.value, currency)}`
                        : null}
                    </p>
                  </div>
                  <span className="w-16 text-right text-lg font-semibold tabular-nums">
                    {formatPercent(slice.percent)}
                  </span>
                  <div className="flex">
                    <PositionFormDialog position={slice.position} />
                    <DeletePositionButton
                      positionId={slice.position.id}
                      positionName={slice.position.name}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {usdRate && needsUsdRate(positions) ? (
        <p className="text-xs text-muted-foreground">
          Para sumar pesos y dólares usamos el dólar MEP de hoy (
          {formatMoney(usdRate, "ARS")}). Los montos son los que cargaste vos,
          no se actualizan con el precio de mercado.
        </p>
      ) : (
        <p className="text-xs text-muted-foreground">
          Los montos son los que cargaste vos, no se actualizan con el precio
          de mercado.
        </p>
      )}
    </div>
  );
}
