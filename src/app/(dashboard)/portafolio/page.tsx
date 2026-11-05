import { createClient } from "@/lib/supabase/server";
import { getDolarRates } from "@/lib/market-data/dolar";
import { getAssetPrice } from "@/lib/market-data";
import {
  isQuantityPosition,
  positionKey,
  type PositionPrices,
} from "@/lib/portfolio/aggregate";
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

  // Un precio por activo cargado por cantidad (aunque se repita).
  const quantityPositions = (positions ?? []).filter(isQuantityPosition);
  const unique = new Map(quantityPositions.map((p) => [positionKey(p), p]));
  const prices: PositionPrices = Object.fromEntries(
    await Promise.all(
      [...unique.entries()].map(
        async ([key, p]) =>
          [
            key,
            await getAssetPrice({
              asset_type: p.asset_type!,
              symbol: p.symbol!,
            }),
          ] as const,
      ),
    ),
  );

  const mep = rates.find((r) => r.moneda === "USD" && r.casa === "bolsa");

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Portafolio"
        description="Cargá cuánto tenés en cada activo y mirá cómo se reparte tu plata."
      />
      <PortfolioView
        positions={positions ?? []}
        usdRate={mep?.venta ?? null}
        prices={prices}
      />
    </div>
  );
}
