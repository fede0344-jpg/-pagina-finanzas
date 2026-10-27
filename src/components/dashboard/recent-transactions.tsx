import Link from "next/link";
import { TransactionFormDialog } from "@/components/transactions/transaction-form-dialog";
import { formatARS, formatDate } from "@/lib/utils/format";
import { cn } from "@/lib/utils";
import type { Category, TransactionWithCategory } from "@/lib/types/domain";
import { Money } from "@/components/privacy/money";

export function RecentTransactions({
  transactions,
  categories,
}: {
  transactions: TransactionWithCategory[];
  categories: Category[];
}) {
  return (
    <section
      className="tile tilt flex flex-col gap-4 lg:col-span-7"
      style={{ "--i": 6 } as React.CSSProperties}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="eyebrow">Últimas transacciones</span>
        <div className="flex items-center gap-2">
          <Link
            href="/transacciones"
            className="text-xs font-bold text-primary underline-offset-4 hover:underline"
          >
            Ver todas
          </Link>
          <TransactionFormDialog categories={categories} />
        </div>
      </div>

      {transactions.length === 0 ? (
        <p className="py-4 text-sm text-muted-foreground">
          Todavía no cargaste ninguna transacción.
        </p>
      ) : (
        <ul className="flex flex-col divide-y divide-foreground/8">
          {transactions.map((t) => (
            <li
              key={t.id}
              className="flex items-center gap-3 py-3 text-sm first:pt-0 last:pb-0"
            >
              <span
                className="size-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: t.category?.color ?? "var(--muted-foreground)" }}
                aria-hidden="true"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">
                  {t.description || t.category?.name || "Sin descripción"}
                </p>
                <p className="truncate font-mono text-xs text-muted-foreground">
                  {formatDate(t.occurred_on)}
                  {t.category ? ` · ${t.category.name}` : ""}
                </p>
              </div>
              <span
                className={cn(
                  "shrink-0 font-bold tabular-nums",
                  t.type === "income" ? "text-positive" : "text-negative",
                )}
              >
                {t.type === "income" ? "+" : "-"}
                <Money>{formatARS(t.amount)}</Money>
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
