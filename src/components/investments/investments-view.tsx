"use client";

import { useCallback, useEffect, useState } from "react";
import { getInvestmentsData } from "@/lib/actions/assets";
import { InvestmentsRefreshContext } from "./investments-refresh-context";
import { AssetFormDialog } from "./asset-form-dialog";
import { RiskSection } from "./risk-section";
import { DolarWidget } from "./dolar-widget";
import type { Asset } from "@/lib/types/domain";
import type { AssetMarketData } from "@/lib/market-data/types";
import type { RiskLevel } from "@/lib/types/database.types";
import type { DolarRate } from "@/lib/market-data/dolar";

type Item = { asset: Asset; data: AssetMarketData };

const REFRESH_MS = 60_000;

export function InvestmentsView({
  initialItems,
  initialDolarRates,
}: {
  initialItems: Item[];
  initialDolarRates: DolarRate[];
}) {
  const [items, setItems] = useState(initialItems);
  const [dolarRates, setDolarRates] = useState(initialDolarRates);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const refresh = useCallback(() => {
    getInvestmentsData()
      .then((fresh) => {
        setItems(fresh.items);
        setDolarRates(fresh.dolarRates);
        setLastUpdated(new Date());
      })
      .catch(() => {
        // keep showing the last known data if a refresh fails
      });
  }, []);

  useEffect(() => {
    const interval = setInterval(refresh, REFRESH_MS);
    return () => clearInterval(interval);
  }, [refresh]);

  const byRisk = (level: RiskLevel) =>
    items.filter(({ asset }) => asset.risk_level === level);

  return (
    <InvestmentsRefreshContext.Provider value={refresh}>
      <div className="flex flex-col gap-6">
        <DolarWidget rates={dolarRates} />
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {lastUpdated
              ? `Actualizado ${lastUpdated.toLocaleTimeString("es-AR")}`
              : "Cotizaciones en vivo"}
          </p>
          <AssetFormDialog />
        </div>
        <RiskSection title="Riesgo bajo" items={byRisk("bajo")} />
        <RiskSection title="Riesgo medio" items={byRisk("medio")} />
        <RiskSection title="Riesgo alto" items={byRisk("alto")} />
      </div>
    </InvestmentsRefreshContext.Provider>
  );
}
