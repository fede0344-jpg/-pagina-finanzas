import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getInvestmentsData } from "@/lib/actions/assets";
import { buildDashboardData } from "@/lib/dashboard/aggregate";
import { BalanceTile } from "@/components/dashboard/balance-tile";
import { StatTile } from "@/components/dashboard/stat-tile";
import { FlowChart } from "@/components/dashboard/flow-chart";
import { CategoryTile } from "@/components/dashboard/category-tile";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { InvestmentsSummaryCard } from "@/components/dashboard/investments-summary-card";
import { PageHeader } from "@/components/layout/page-header";
import { buttonVariants } from "@/components/ui/button";
import type { TransactionWithCategory } from "@/lib/types/domain";

export default async function DashboardPage() {
  const supabase = await createClient();

  const [
    { data: transactions },
    { data: categories },
    { data: recentTransactions },
    { items: investmentItems },
  ] = await Promise.all([
    supabase
      .from("transactions")
      .select("type, amount, occurred_on, category_id"),
    supabase.from("categories").select("*"),
    supabase
      .from("transactions")
      .select("*, category:categories(id, name, color, kind)")
      .order("occurred_on", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(5),
    getInvestmentsData(),
  ]);

  const {
    balance,
    incomeThisMonth,
    expenseThisMonth,
    savings,
    savingsRate,
    expenseByCategory,
    monthlyTrend,
    balanceCurve,
  } = buildDashboardData(transactions ?? [], categories ?? []);

  const hasTransactions = (transactions ?? []).length > 0;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Tu plata, de un vistazo"
        description="Balance, movimientos del mes e inversiones en una sola pantalla."
      />

      <div className="grid gap-4 lg:grid-cols-12">
        <BalanceTile
          balance={balance}
          curve={balanceCurve}
          savingsRate={savingsRate}
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-5">
          <StatTile
            kind="ing"
            index={1}
            label="Ingresos del mes"
            amount={incomeThisMonth}
          />
          <StatTile
            kind="gas"
            index={2}
            label="Gastos del mes"
            amount={expenseThisMonth}
          />
          <StatTile
            kind="aho"
            index={3}
            className="sm:col-span-2"
            label="Ahorro del mes"
            amount={savings}
            hint={
              savingsRate !== null
                ? `${savingsRate >= 0 ? "+" : ""}${savingsRate.toFixed(0)}% del ingreso`
                : undefined
            }
          />
        </div>

        {hasTransactions ? (
          <>
            <section
              className="tile tilt lg:col-span-7"
              style={{ "--i": 4 } as React.CSSProperties}
            >
              <FlowChart data={monthlyTrend} />
            </section>
            <CategoryTile data={expenseByCategory} />
          </>
        ) : (
          <section
            className="tile flex flex-col items-center gap-4 py-12 text-center lg:col-span-12"
            style={{ "--i": 4 } as React.CSSProperties}
          >
            <p className="display text-2xl">Todavía no hay movimientos</p>
            <p className="max-w-sm text-sm text-muted-foreground">
              Cargá tu primer ingreso o gasto y acá vas a ver el balance, el
              gráfico por mes y tus gastos por categoría.
            </p>
            <Link
              href="/transacciones"
              className={buttonVariants({ variant: "default", size: "lg" })}
            >
              Cargar mi primer movimiento
            </Link>
          </section>
        )}

        <RecentTransactions
          transactions={(recentTransactions ?? []) as TransactionWithCategory[]}
          categories={categories ?? []}
        />
        <InvestmentsSummaryCard items={investmentItems} />
      </div>
    </div>
  );
}
