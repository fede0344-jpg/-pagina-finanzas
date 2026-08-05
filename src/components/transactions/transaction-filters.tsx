"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Category } from "@/lib/types/domain";

export function TransactionFilters({
  categories,
}: {
  categories: Category[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const month = searchParams.get("month") ?? "";
  const type = searchParams.get("type") ?? "";
  const categoryId = searchParams.get("category_id") ?? "";

  function pushParams(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    router.push(params.size ? `${pathname}?${params.toString()}` : pathname);
  }

  const filteredCategories = type
    ? categories.filter((c) => c.kind === type)
    : categories;
  const hasFilters = Boolean(month || type || categoryId);

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="month-filter"
          className="text-xs text-muted-foreground"
        >
          Mes
        </label>
        <Input
          id="month-filter"
          type="month"
          value={month}
          onChange={(e) => pushParams({ month: e.target.value || null })}
          className="w-40"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-xs text-muted-foreground">Tipo</span>
        <Select
          value={type || null}
          onValueChange={(value) => {
            const current = categories.find((c) => c.id === categoryId);
            const shouldResetCategory =
              categoryId && value && current && current.kind !== value;
            pushParams({
              type: value,
              ...(shouldResetCategory ? { category_id: null } : {}),
            });
          }}
        >
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={null}>Todos</SelectItem>
            <SelectItem value="income">Ingreso</SelectItem>
            <SelectItem value="expense">Gasto</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-xs text-muted-foreground">Categoría</span>
        <Select
          value={categoryId || null}
          onValueChange={(value) => pushParams({ category_id: value })}
        >
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Todas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={null}>Todas</SelectItem>
            {filteredCategories.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {hasFilters ? (
        <Button variant="ghost" onClick={() => router.push(pathname)}>
          Limpiar filtros
        </Button>
      ) : null}
    </div>
  );
}
