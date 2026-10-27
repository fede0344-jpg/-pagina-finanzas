import { AssetCard } from "./asset-card";
import type { Asset } from "@/lib/types/domain";
import type { AssetMarketData } from "@/lib/market-data/types";

export function RiskSection({
  title,
  items,
}: {
  title: string;
  items: { asset: Asset; data: AssetMarketData }[];
}) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="display text-2xl">{title}</h2>
      {items.length === 0 ? (
        <div className="tile py-10 text-center text-sm text-muted-foreground">
          Todavía no agregaste activos en este nivel de riesgo.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(({ asset, data }) => (
            <AssetCard key={asset.id} asset={asset} data={data} />
          ))}
        </div>
      )}
    </section>
  );
}
