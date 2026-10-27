import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoryFormDialog } from "./category-form-dialog";
import { DeleteCategoryButton } from "./delete-category-button";
import type { Category } from "@/lib/types/domain";

function CategoryGroup({
  title,
  categories,
}: {
  title: string;
  categories: Category[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="display text-2xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        {categories.length === 0 ? (
          <p className="py-2 text-sm text-muted-foreground">
            Todavía no creaste categorías de este tipo.
          </p>
        ) : (
          categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center gap-3 rounded-xl px-2 py-2.5 hover:bg-muted"
            >
              <span
                className="size-3 shrink-0 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              <span className="flex-1 truncate text-sm font-semibold">{category.name}</span>
              <div className="flex items-center gap-1">
                <CategoryFormDialog category={category} />
                <DeleteCategoryButton
                  categoryId={category.id}
                  categoryName={category.name}
                />
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

export function CategoryList({ categories }: { categories: Category[] }) {
  const income = categories.filter((c) => c.kind === "income");
  const expense = categories.filter((c) => c.kind === "expense");

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <CategoryGroup title="Ingresos" categories={income} />
      <CategoryGroup title="Gastos" categories={expense} />
    </div>
  );
}
