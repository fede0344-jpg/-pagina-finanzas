function PreviewTile({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "neutral" | "positive" | "negative";
}) {
  return (
    <div className="rounded-lg border bg-background p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p
        className={
          "mt-1 text-lg font-semibold " +
          (tone === "positive"
            ? "text-positive"
            : tone === "negative"
              ? "text-negative"
              : "")
        }
      >
        {value}
      </p>
    </div>
  );
}

const CATEGORY_ROWS = [
  { label: "Vivienda", pct: 80, color: "var(--negative)" },
  { label: "Alimentación", pct: 55, color: "#f97316" },
  { label: "Transporte", pct: 35, color: "#eab308" },
];

const TREND_BARS = [40, 65, 50, 80, 60, 90];

export function DashboardPreview() {
  return (
    <div
      aria-hidden
      className="mx-auto max-w-3xl rounded-2xl border bg-card p-4 shadow-2xl sm:p-6"
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <PreviewTile label="Balance" value="$1.284.500" />
        <PreviewTile label="Ingresos del mes" value="$650.000" tone="positive" />
        <PreviewTile label="Gastos del mes" value="$310.000" tone="negative" />
        <PreviewTile label="Ahorro del mes" value="+52%" tone="positive" />
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border bg-background p-4">
          <p className="text-xs font-medium text-muted-foreground">
            Gastos por categoría
          </p>
          <div className="mt-3 flex flex-col gap-2.5">
            {CATEGORY_ROWS.map((row) => (
              <div key={row.label} className="flex items-center gap-2">
                <span className="w-20 shrink-0 text-xs text-muted-foreground">
                  {row.label}
                </span>
                <div className="h-2 flex-1 rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full"
                    style={{ width: `${row.pct}%`, backgroundColor: row.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border bg-background p-4">
          <p className="text-xs font-medium text-muted-foreground">
            Ingresos vs. gastos
          </p>
          <div className="mt-3 flex h-24 items-end gap-2">
            {TREND_BARS.map((h, i) => (
              <div key={i} className="flex flex-1 items-end gap-0.5">
                <div
                  className="flex-1 rounded-t bg-positive"
                  style={{ height: `${h}%` }}
                />
                <div
                  className="flex-1 rounded-t bg-negative"
                  style={{ height: `${h * 0.6}%` }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
