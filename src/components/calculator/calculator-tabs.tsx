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
      <div className="flex gap-2">
        {TABS.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => setTab(t.value)}
            className={
              tab === t.value
                ? "rounded-md border border-primary bg-primary/10 px-3 py-2 text-sm font-medium text-primary"
                : "rounded-md border px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
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
