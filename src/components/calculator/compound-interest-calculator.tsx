"use client";

import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SummaryCard } from "@/components/dashboard/summary-card";
import { CompoundInterestChart } from "./compound-interest-chart";
import {
  calculateCompoundInterest,
  COMPOUND_FREQUENCIES,
} from "@/lib/calculators/compound-interest";
import { formatCurrency } from "@/lib/utils/format";
import { cn } from "@/lib/utils";

function parseNumber(value: string): number {
  const n = Number(value.replace(",", "."));
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

export function CompoundInterestCalculator() {
  const [initial, setInitial] = useState("1000000");
  const [monthlyContribution, setMonthlyContribution] = useState("50000");
  const [years, setYears] = useState("10");
  const [annualRate, setAnnualRate] = useState("40");
  const [compoundsPerYear, setCompoundsPerYear] = useState("12");
  const [showTable, setShowTable] = useState(false);

  const result = useMemo(
    () =>
      calculateCompoundInterest({
        initial: parseNumber(initial),
        monthlyContribution: parseNumber(monthlyContribution),
        years: Math.min(Math.max(parseNumber(years), 1), 60),
        annualRatePercent: parseNumber(annualRate),
        compoundsPerYear: Number(compoundsPerYear),
      }),
    [initial, monthlyContribution, years, annualRate, compoundsPerYear],
  );

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="initial">Monto inicial</Label>
            <Input
              id="initial"
              inputMode="decimal"
              value={initial}
              onChange={(e) => setInitial(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="monthly">Aporte mensual</Label>
            <Input
              id="monthly"
              inputMode="decimal"
              value={monthlyContribution}
              onChange={(e) => setMonthlyContribution(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="years">Años</Label>
            <Input
              id="years"
              inputMode="decimal"
              value={years}
              onChange={(e) => setYears(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="rate">Tasa de interés anual estimada (%)</Label>
            <Input
              id="rate"
              inputMode="decimal"
              value={annualRate}
              onChange={(e) => setAnnualRate(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Frecuencia de capitalización</Label>
            <Select
              value={compoundsPerYear}
              onValueChange={(value) => setCompoundsPerYear(value as string)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {COMPOUND_FREQUENCIES.map((freq) => (
                  <SelectItem key={freq.value} value={String(freq.value)}>
                    {freq.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        <SummaryCard label="Balance final" amount={result.endBalance} />
        <SummaryCard
          label="Total aportado"
          amount={result.totalContributions}
        />
        <SummaryCard
          label="Interés generado"
          amount={result.totalInterest}
          tone="positive"
        />
      </div>

      <Card>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Crecimiento por año</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowTable((v) => !v)}
            >
              {showTable ? "Ver gráfico" : "Ver tabla"}
            </Button>
          </div>

          {showTable ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs text-muted-foreground">
                    <th className="py-2 font-medium">Año</th>
                    <th className="py-2 font-medium">Aportado</th>
                    <th className="py-2 font-medium">Interés</th>
                    <th className="py-2 font-medium">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {result.yearly.map((point) => (
                    <tr key={point.year} className="border-b last:border-0">
                      <td className="py-2 tabular-nums">{point.year}</td>
                      <td className="py-2 tabular-nums">
                        {formatCurrency(point.totalContributions)}
                      </td>
                      <td
                        className={cn(
                          "py-2 tabular-nums",
                          point.totalInterest >= 0 && "text-positive",
                        )}
                      >
                        {formatCurrency(point.totalInterest)}
                      </td>
                      <td className="py-2 font-medium tabular-nums">
                        {formatCurrency(point.balance)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <CompoundInterestChart data={result.yearly} />
          )}
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground">
        Estimación matemática con una tasa de interés fija y aportes
        mensuales constantes. No contempla inflación, impuestos ni
        variaciones reales de mercado — no es asesoramiento financiero.
      </p>
    </div>
  );
}
