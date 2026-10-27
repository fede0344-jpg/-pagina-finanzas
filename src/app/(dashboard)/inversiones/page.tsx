import { getInvestmentsData } from "@/lib/actions/assets";
import { getEconomicNews } from "@/lib/market-data/news";
import { InvestmentsView } from "@/components/investments/investments-view";
import { NewsWidget } from "@/components/investments/news-widget";
import { PageHeader } from "@/components/layout/page-header";

export default async function InversionesPage() {
  const [{ items, dolarRates }, news] = await Promise.all([
    getInvestmentsData(),
    getEconomicNews(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Inversiones"
        description="Tus activos agrupados por nivel de riesgo. El precio se actualiza solo cada un minuto."
      />

      <InvestmentsView initialItems={items} initialDolarRates={dolarRates} />

      <NewsWidget items={news} />

      <p className="text-center text-xs text-muted-foreground">
        Cotizaciones de fuentes externas (CoinGecko, data912.com, dolarapi.com),
        con demora. No es asesoramiento financiero.
      </p>
    </div>
  );
}
