import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TransactionFormDialog } from "@/components/transactions/transaction-form-dialog";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import { cn } from "@/lib/utils";
import type { Category, TransactionWithCategory } from "@/lib/types/domain";

export function RecentTransactions({
  transactions,
  categories,
}: {
  transactions: TransactionWithCategory[];
  categories: Category[];
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Últimas transacciones</CardTitle>
        <TransactionFormDialog categories={categories} />
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Todavía no cargaste ninguna transacción.
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {transactions.map((t) => (
              <li key={t.id} className="flex items-center gap-3 text-sm">
                <span className="w-16 shrink-0 text-xs text-muted-foreground">
                  {formatDate(t.occurred_on)}
                </span>
                <span className="flex-1 truncate">
                  {t.description || t.category?.name || "Sin descripción"}
                </span>
                {t.category ? (
                  <Badge
                    variant="outline"
                    className="hidden font-normal sm:inline-flex"
                    style={{ borderColor: t.category.color }}
                  >
                    {t.category.name}
                  </Badge>
                ) : null}
                <span
                  className={cn(
                    "font-medium tabular-nums",
                    t.type === "income" ? "text-positive" : "text-negative",
                  )}
                >
                  {t.type === "income" ? "+" : "-"}
                  {formatCurrency(t.amount)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
