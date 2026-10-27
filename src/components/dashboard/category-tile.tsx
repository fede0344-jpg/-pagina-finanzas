import { formatARS } from "@/lib/utils/format";

interface ExpenseByCategory {
  id: string;
  name: string;
  color: string;
  amount: number;
}

export function CategoryTile({ data }: { data: ExpenseByCategory[] }) {
  const total = data.reduce((sum, d) => sum + d.amount, 0);

  return (
    <section
      className="tile tile-soft tilt flex flex-col gap-5 lg:col-span-5"
      style={{ "--i": 5 } as React.CSSProperties}
    >
      <div className="flex items-baseline justify-between gap-3">
        <span className="eyebrow">Gastos por categoría</span>
        <span className="font-mono text-xs text-muted-foreground">este mes</span>
      </div>

      {data.length === 0 ? (
        <p className="py-6 text-sm text-muted-foreground">
          Todavía no cargaste gastos este mes.
        </p>
      ) : (
        <ul className="flex flex-col gap-3.5">
          {data.map((d, i) => {
            const pct = total > 0 ? (d.amount / total) * 100 : 0;
            return (
              <li key={d.id} className="flex flex-col gap-1.5">
                <div className="flex items-baseline justify-between gap-3 text-sm">
                  <span className="truncate font-semibold">{d.name}</span>
                  <span className="shrink-0 font-mono text-xs text-muted-foreground">
                    {pct.toFixed(0)}% · {formatARS(d.amount)}
                  </span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-foreground/8">
                  <div
                    className="bar-x h-full rounded-full"
                    style={
                      {
                        width: `${Math.max(pct, 3)}%`,
                        background: `linear-gradient(90deg, color-mix(in srgb, ${d.color} 78%, #fff), ${d.color})`,
                        "--k": i,
                      } as React.CSSProperties
                    }
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
