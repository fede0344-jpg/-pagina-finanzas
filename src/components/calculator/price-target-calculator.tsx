"use client";

import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SummaryCard } from "@/components/dashboard/summary-card";
import { PriceTargetChart } from "./price-target-chart";
import { calculatePriceTargetReturn } from "@/lib/calculators/price-target";
import { formatCurrency } from "@/lib/utils/format";
import { cn } from "@/lib/utils";

function parseNumber(value: string): number {
  const n = Number(value.replace(",", "."));
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

function parseSignedNumber(value: string): number {
  const n = Number(value.replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

function formatPercent(value: number): string {
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}

type TargetMode = "price" | "percent";

export function PriceTargetCalculator() {
  const [investedAmount, setInvestedAmount] = useState("20000");
  const [currentPrice, setCurrentPrice] = useState("64000");
  const [targetMode, setTargetMode] = useState<TargetMode>("price");
  const [targetPrice, setTargetPrice] = useState("200000");
  const [targetPercent, setTargetPercent] = useState("212.5");
  const [years, setYears] = useState("2");

  const effectiveTargetPrice = useMemo(() => {
    if (targetMode === "price") return parseNumber(targetPrice);
    const price = parseNumber(currentPrice);
    return price * (1 + parseSignedNumber(targetPercent) / 100);
  }, [targetMode, targetPrice, targetPercent, currentPrice]);

  const result = useMemo(
    () =>
      calculatePriceTargetReturn({
        investedAmount: parseNumber(investedAmount),
        currentPrice: parseNumber(currentPrice),
        targetPrice: effectiveTargetPrice,
        years: Math.min(Math.max(parseNumber(years), 0), 60),
      }),
    [investedAmount, currentPrice, effectiveTargetPrice, years],
  );

  const gainIsPositive = result.gain >= 0;

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="invested">Monto invertido</Label>
            <Input
              id="invested"
              inputMode="decimal"
              value={investedAmount}
              onChange={(e) => setInvestedAmount(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="currentPrice">Precio de compra actual</Label>
            <Input
              id="currentPrice"
              inputMode="decimal"
              value={currentPrice}
              onChange={(e) => setCurrentPrice(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor={targetMode === "price" ? "targetPrice" : "targetPercent"}>
                {targetMode === "price" ? "Precio proyectado" : "% de suba proyectado"}
              </Label>
              <div className="flex overflow-hidden rounded-md border text-xs">
                <button
                  type="button"
                  onClick={() => setTargetMode("price")}
                  className={cn(
                    "px-2 py-1",
                    targetMode === "price"
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  Precio
                </button>
                <button
                  type="button"
                  onClick={() => setTargetMode("percent")}
                  className={cn(
                    "border-l px-2 py-1",
                    targetMode === "percent"
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  %
                </button>
              </div>
            </div>
            {targetMode === "price" ? (
              <Input
                id="targetPrice"
                inputMode="decimal"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
              />
            ) : (
              <Input
                id="targetPercent"
                inputMode="decimal"
                value={targetPercent}
                onChange={(e) => setTargetPercent(e.target.value)}
                placeholder="ej: 212.5 o -20"
              />
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="targetYears">Plazo estimado (años)</Label>
            <Input
              id="targetYears"
              inputMode="decimal"
              value={years}
              onChange={(e) => setYears(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">
        Con {formatCurrency(parseNumber(investedAmount))} comprás
        aproximadamente{" "}
        <span className="font-medium text-foreground">
          {result.quantity.toLocaleString("es-AR", { maximumFractionDigits: 6 })}
        </span>{" "}
        unidades al precio actual.
        {targetMode === "percent" ? (
          <>
            {" "}Eso equivale a un precio proyectado de{" "}
            <span className="font-medium text-foreground">
              {formatCurrency(effectiveTargetPrice)}
            </span>
            .
          </>
        ) : null}
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          label="Valor proyectado"
          amount={result.projectedValue}
        />
        <SummaryCard
          label="Ganancia"
          amount={result.gain}
          tone={gainIsPositive ? "positive" : "negative"}
        />
        <Card>
          <CardContent className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">
              Rendimiento total
            </span>
            <span
              className={cn(
                "text-2xl font-semibold",
                gainIsPositive ? "text-positive" : "text-negative",
              )}
            >
              {formatPercent(result.totalReturnPercent)}
            </span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">
              Rendimiento anualizado
            </span>
            <span
              className={cn(
                "text-2xl font-semibold",
                result.annualizedReturnPercent === null
                  ? "text-muted-foreground"
                  : result.annualizedReturnPercent >= 0
                    ? "text-positive"
                    : "text-negative",
              )}
            >
              {result.annualizedReturnPercent === null
                ? "—"
                : formatPercent(result.annualizedReturnPercent)}
            </span>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-4">
          <p className="text-sm font-medium">Proyección de valor en el tiempo</p>
          <PriceTargetChart data={result.yearly} />
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground">
        Proyección ilustrativa a partir de un precio objetivo que vos elegís
        — no es un pronóstico ni una recomendación. Los precios reales de
        cripto, CEDEARs, acciones y bonos pueden variar mucho más de lo que
        muestra esta curva.
      </p>
    </div>
  );
}
