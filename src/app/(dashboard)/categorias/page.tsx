import { createClient } from "@/lib/supabase/server";
import { CategoryList } from "@/components/categories/category-list";
import { CategoryFormDialog } from "@/components/categories/category-form-dialog";

export default async function CategoriasPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("kind")
    .order("name");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Categorías</h1>
          <p className="text-sm text-muted-foreground">
            Organizá tus ingresos y gastos por categoría.
          </p>
        </div>
        <CategoryFormDialog />
      </div>
      <CategoryList categories={categories ?? []} />
    </div>
  );
}
