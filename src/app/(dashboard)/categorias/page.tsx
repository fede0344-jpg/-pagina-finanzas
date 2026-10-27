import { createClient } from "@/lib/supabase/server";
import { CategoryList } from "@/components/categories/category-list";
import { CategoryFormDialog } from "@/components/categories/category-form-dialog";
import { PageHeader } from "@/components/layout/page-header";

export default async function CategoriasPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("kind")
    .order("name");

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Categorías"
        description="Organizá tus ingresos y gastos por categoría."
        action={<CategoryFormDialog />}
      />
      <CategoryList categories={categories ?? []} />
    </div>
  );
}
