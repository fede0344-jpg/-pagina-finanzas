import { createClient } from "@/lib/supabase/server";
import { TransactionFilters } from "@/components/transactions/transaction-filters";
import { TransactionTable } from "@/components/transactions/transaction-table";
import { TransactionFormDialog } from "@/components/transactions/transaction-form-dialog";
import { PageHeader } from "@/components/layout/page-header";
import type { TransactionWithCategory } from "@/lib/types/domain";

function monthRange(month: string) {
  const [year, m] = month.split("-").map(Number);
  const from = `${month}-01`;
  const lastDay = new Date(year, m, 0).getDate();
  const to = `${month}-${String(lastDay).padStart(2, "0")}`;
  return { from, to };
}

export default async function TransaccionesPage({
  searchParams,
}: {
  searchParams: Promise<{
    month?: string;
    type?: string;
    category_id?: string;
  }>;
}) {
  const { month, type, category_id } = await searchParams;
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("kind")
    .order("name");

  let query = supabase
    .from("transactions")
    .select("*, category:categories(id, name, color, kind)")
    .order("occurred_on", { ascending: false })
    .order("created_at", { ascending: false });

  if (month) {
    const { from, to } = monthRange(month);
    query = query.gte("occurred_on", from).lte("occurred_on", to);
  }
  if (type === "income" || type === "expense") {
    query = query.eq("type", type);
  }
  if (category_id) {
    query = query.eq("category_id", category_id);
  }

  const { data: transactions } = await query;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Transacciones"
        description="Registrá y filtrá tus ingresos y gastos."
        action={<TransactionFormDialog categories={categories ?? []} />}
      />
      <TransactionFilters categories={categories ?? []} />
      <TransactionTable
        transactions={(transactions ?? []) as TransactionWithCategory[]}
        categories={categories ?? []}
      />
    </div>
  );
}
