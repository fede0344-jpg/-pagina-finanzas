import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { buildDashboardData } from "@/lib/dashboard/aggregate";
import { SummaryCard } from "@/components/dashboard/summary-card";
import { ExpensesByCategoryChart } from "@/components/dashboard/expenses-by-category-chart";
import { IncomeExpenseTrendChart } from "@/components/dashboard/income-expense-trend-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";

export default async function DashboardPage() {
  const supabase = await createClient();

  const [{ data: transactions }, { data: categories }] = await Promise.all([
    supabase
      .from("transactions")
      .select("type, amount, occurred_on, category_id"),
    supabase.from("categories").select("id, name, color"),
  ]);

  const { balance, incomeThisMonth, expenseThisMonth, savings, expenseByCategory, monthlyTrend } =
    buildDashboardData(transactions ?? [], categories ?? []);

  const hasTransactions = (transactions ?? []).length > 0;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Tu resumen financiero de un vistazo.
        </p>
      </div>

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
        />
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
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Gastos por categoría (este mes)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ExpensesByCategoryChart data={expenseByCategory} />
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
