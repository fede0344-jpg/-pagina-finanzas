import { createClient } from "@/lib/supabase/server";
import { getDolarRates } from "@/lib/market-data/dolar";
import { PageHeader } from "@/components/layout/page-header";
import { PortfolioView } from "@/components/portfolio/portfolio-view";

export default async function PortafolioPage() {
  const supabase = await createClient();

  const [{ data: positions }, rates] = await Promise.all([
    supabase
      .from("portfolio_positions")
      .select("*")
      .order("created_at", { ascending: true }),
    getDolarRates(),
  ]);

  const mep = rates.find((r) => r.moneda === "USD" && r.casa === "bolsa");

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Portafolio"
        description="Cargá cuánto tenés en cada activo y mirá cómo se reparte tu plata."
      />
      <PortfolioView positions={positions ?? []} usdRate={mep?.venta ?? null} />
    </div>
  );
}
