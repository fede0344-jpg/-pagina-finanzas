import { lastNMonthKeys, monthKey, formatMonthLabel } from "@/lib/utils/date-ranges";
import type { MoneyFlow } from "@/lib/types/database.types";

interface TransactionRow {
  type: MoneyFlow;
  amount: number;
  occurred_on: string;
  category_id: string | null;
}

interface CategoryRow {
  id: string;
  name: string;
  color: string;
}

const NO_CATEGORY_COLOR = "#94a3b8";

// Meses que se arma la serie del gráfico; la pantalla elige cuántos mostrar.
export const TREND_MONTHS = 24;
// Meses que dibuja la curva del balance.
const BALANCE_CURVE_MONTHS = 12;

export function buildDashboardData(
  transactions: TransactionRow[],
  categories: CategoryRow[],
  now = new Date(),
) {
  const currentMonth = monthKey(now);
  const trendMonths = lastNMonthKeys(TREND_MONTHS, now);

  let balance = 0;
  let incomeThisMonth = 0;
  let expenseThisMonth = 0;
  const expenseByCategory = new Map<string, number>();
  const monthlyTotals = new Map(
    trendMonths.map((key) => [key, { income: 0, expense: 0 }]),
  );

  for (const tx of transactions) {
    balance += tx.type === "income" ? tx.amount : -tx.amount;

    const txMonth = tx.occurred_on.slice(0, 7);
    if (txMonth === currentMonth) {
      if (tx.type === "income") {
        incomeThisMonth += tx.amount;
      } else {
        expenseThisMonth += tx.amount;
        const key = tx.category_id ?? "none";
        expenseByCategory.set(key, (expenseByCategory.get(key) ?? 0) + tx.amount);
      }
    }

    const bucket = monthlyTotals.get(txMonth);
    if (bucket) {
      if (tx.type === "income") bucket.income += tx.amount;
      else bucket.expense += tx.amount;
    }
  }

  const categoryMap = new Map(categories.map((c) => [c.id, c]));
  const expenseByCategoryList = [...expenseByCategory.entries()]
    .map(([id, amount]) => ({
      id,
      name: id === "none" ? "Sin categoría" : (categoryMap.get(id)?.name ?? "Sin categoría"),
      color: id === "none" ? NO_CATEGORY_COLOR : (categoryMap.get(id)?.color ?? NO_CATEGORY_COLOR),
      amount,
    }))
    .sort((a, b) => b.amount - a.amount);

  // Balance acumulado al cierre de cada mes, para la curva del bloque principal.
  const curveMonths = lastNMonthKeys(BALANCE_CURVE_MONTHS, now);
  const firstCurveMonth = curveMonths[0];
  let running = 0;
  for (const tx of transactions) {
    if (tx.occurred_on.slice(0, 7) < firstCurveMonth) {
      running += tx.type === "income" ? tx.amount : -tx.amount;
    }
  }
  const netByMonth = new Map<string, number>();
  for (const tx of transactions) {
    const m = tx.occurred_on.slice(0, 7);
    netByMonth.set(m, (netByMonth.get(m) ?? 0) + (tx.type === "income" ? tx.amount : -tx.amount));
  }
  const balanceCurve = curveMonths.map((key) => {
    running += netByMonth.get(key) ?? 0;
    return running;
  });

  const monthlyTrend = trendMonths.map((key) => ({
    month: key,
    label: formatMonthLabel(key),
    ingresos: monthlyTotals.get(key)!.income,
    gastos: monthlyTotals.get(key)!.expense,
  }));

  const savings = incomeThisMonth - expenseThisMonth;
  const savingsRate =
    incomeThisMonth > 0 ? (savings / incomeThisMonth) * 100 : null;

  return {
    balance,
    incomeThisMonth,
    expenseThisMonth,
    savings,
    savingsRate,
    expenseByCategory: expenseByCategoryList,
    monthlyTrend,
    balanceCurve,
  };
}

export type DashboardData = ReturnType<typeof buildDashboardData>;
