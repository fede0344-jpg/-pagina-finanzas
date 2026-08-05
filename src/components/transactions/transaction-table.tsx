import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TransactionFormDialog } from "./transaction-form-dialog";
import { DeleteTransactionButton } from "./delete-transaction-button";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import { cn } from "@/lib/utils";
import type { Category, TransactionWithCategory } from "@/lib/types/domain";

export function TransactionTable({
  transactions,
  categories,
}: {
  transactions: TransactionWithCategory[];
  categories: Category[];
}) {
  if (transactions.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-10 text-center text-sm text-muted-foreground">
        No hay transacciones para los filtros seleccionados.
      </div>
    );
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fecha</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead className="text-right">Monto</TableHead>
            <TableHead className="w-0">
              <span className="sr-only">Acciones</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((t) => (
            <TableRow key={t.id}>
              <TableCell className="text-muted-foreground">
                {formatDate(t.occurred_on)}
              </TableCell>
              <TableCell className="max-w-56 truncate">
                {t.description || (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell>
                {t.category ? (
                  <Badge
                    variant="outline"
                    className="gap-1.5 font-normal"
                    style={{ borderColor: t.category.color }}
                  >
                    <span
                      className="size-2 rounded-full"
                      style={{ backgroundColor: t.category.color }}
                    />
                    {t.category.name}
                  </Badge>
                ) : (
                  <span className="text-sm text-muted-foreground">
                    Sin categoría
                  </span>
                )}
              </TableCell>
              <TableCell
                className={cn(
                  "text-right font-medium tabular-nums",
                  t.type === "income" ? "text-positive" : "text-negative",
                )}
              >
                {t.type === "income" ? "+" : "-"}
                {formatCurrency(t.amount)}
              </TableCell>
              <TableCell>
                <div className="flex justify-end gap-1">
                  <TransactionFormDialog
                    categories={categories}
                    transaction={t}
                  />
                  <DeleteTransactionButton transactionId={t.id} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
