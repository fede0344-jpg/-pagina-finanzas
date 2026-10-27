"use client";

import { useState } from "react";
import { CompoundInterestCalculator } from "./compound-interest-calculator";
import { PriceTargetCalculator } from "./price-target-calculator";

const TABS = [
  { value: "compound", label: "Interés compuesto" },
  { value: "price-target", label: "Rendimiento proyectado" },
] as const;

type TabValue = (typeof TABS)[number]["value"];

export function CalculatorTabs() {
  const [tab, setTab] = useState<TabValue>("compound");

  return (
    <div className="flex flex-col gap-6">
      <div className="inline-flex w-fit max-w-full flex-wrap gap-1 rounded-3xl bg-card p-1 ring-1 ring-foreground/8">
        {TABS.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => setTab(t.value)}
            className={
              tab === t.value
                ? "rounded-full bg-ink px-4 py-2 text-sm font-bold text-on-ink"
                : "rounded-full px-4 py-2 text-sm font-bold text-muted-foreground transition-colors hover:text-foreground"
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "compound" ? (
        <CompoundInterestCalculator />
      ) : (
        <PriceTargetCalculator />
      )}
    </div>
  );
}
