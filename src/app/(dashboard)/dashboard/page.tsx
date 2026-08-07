import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getInvestmentsData } from "@/lib/actions/assets";
import { buildDashboardData } from "@/lib/dashboard/aggregate";
import { SummaryCard } from "@/components/dashboard/summary-card";
import { ExpensesByCategoryChart } from "@/components/dashboard/expenses-by-category-chart";
import { ExpenseCategoryBreakdown } from "@/components/dashboard/expense-category-breakdown";
import { IncomeExpenseTrendChart } from "@/components/dashboard/income-expense-trend-chart";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { InvestmentsSummaryCard } from "@/components/dashboard/investments-summary-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  } = buildDashboardData(transactions ?? [], categories ?? []);

  const hasTransactions = (transactions ?? []).length > 0;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Dashboard"
        description="Tu resumen financiero de un vistazo."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard label="Balance total" amount={balance} />
        <SummaryCard
          label="Ingresos del mes"
          amount={incomeThisMonth}
          tone="positive"
        />
        <SummaryCard
          label="Gastos del mes"
          amount={expenseThisMonth}
          tone="negative"
        />
        <SummaryCard
          label="Ahorro del mes"
          amount={savings}
          tone={savings >= 0 ? "positive" : "negative"}
          hint={
            savingsRate !== null
              ? `${savingsRate >= 0 ? "+" : ""}${savingsRate.toFixed(0)}% del ingreso`
              : undefined
          }
        />
      </div>

      <div className="reveal grid gap-4 lg:grid-cols-2">
        <RecentTransactions
          transactions={(recentTransactions ?? []) as TransactionWithCategory[]}
          categories={categories ?? []}
        />
        <InvestmentsSummaryCard items={investmentItems} />
      </div>

      {!hasTransactions ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
            <p className="text-sm text-muted-foreground">
              Todavía no cargaste ninguna transacción.
            </p>
            <Link
              href="/transacciones"
              className={buttonVariants({ variant: "default" })}
            >
              Cargar tu primera transacción
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="reveal grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Gastos por categoría (este mes)
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <ExpensesByCategoryChart data={expenseByCategory} />
              <ExpenseCategoryBreakdown data={expenseByCategory} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Ingresos vs. gastos (últimos 6 meses)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <IncomeExpenseTrendChart data={monthlyTrend} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
