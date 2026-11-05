import { createClient } from "@/lib/supabase/server";
import { getAssetPrice } from "@/lib/market-data";
import {
  buildPurchases,
  groupKey,
} from "@/lib/purchases/aggregate";
import { PageHeader } from "@/components/layout/page-header";
import { InvestmentsTabs } from "@/components/investments/investments-tabs";
import { PurchasesView } from "@/components/purchases/purchases-view";
import { PurchaseFormDialog } from "@/components/purchases/purchase-form-dialog";
import { ImportDialog } from "@/components/purchases/import-dialog";

export const metadata = { title: "Mis compras" };

export default async function ComprasPage() {
  const supabase = await createClient();

  const [{ data: purchases }, { data: assets }] = await Promise.all([
    supabase
      .from("purchases")
      .select("*")
      .order("purchase_date", { ascending: false })
      .order("created_at", { ascending: false }),
    supabase.from("assets").select("*").order("name"),
  ]);

  const list = purchases ?? [];

  // Una cotización por activo, aunque tenga varias compras.
  const unique = new Map(list.map((p) => [groupKey(p), p]));
  const entries = await Promise.all(
    [...unique.entries()].map(
      async ([key, p]) =>
        [
          key,
          await getAssetPrice({ asset_type: p.asset_type, symbol: p.symbol }),
        ] as const,
    ),
  );
  const prices = new Map(entries);

  const { groups, totals, withoutPrice } = buildPurchases(list, prices);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Mis compras"
        description="Anotá lo que comprás y mirá cuánto ganás o perdés con el precio de hoy."
        action={
          <div className="flex flex-wrap gap-2">
            <ImportDialog
              existing={list
                .filter((p) => p.asset_type === "crypto")
                .map((p) => ({
                  symbol: p.symbol,
                  date: p.purchase_date,
                  invested: p.invested,
                }))}
            />
            <PurchaseFormDialog assets={assets ?? []} />
          </div>
        }
      />
      <InvestmentsTabs active="/inversiones/compras" />
      <PurchasesView
        groups={groups}
        totals={totals}
        withoutPrice={withoutPrice}
        assets={assets ?? []}
      />
    </div>
  );
}
