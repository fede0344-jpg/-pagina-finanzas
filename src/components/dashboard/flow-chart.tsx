"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { formatARSWhole as formatARS, formatCompactARS } from "@/lib/utils/format";

interface MonthlyPoint {
  month: string; // "2026-03"
  ingresos: number;
  gastos: number;
}

const MESES = [
  "ene",
  "feb",
  "mar",
  "abr",
  "may",
  "jun",
  "jul",
  "ago",
  "sep",
  "oct",
  "nov",
  "dic",
];

const RANGES = [
  { label: "3M", n: 3 },
  { label: "6M", n: 6 },
  { label: "1A", n: 12 },
  { label: "Todo", n: 0 },
] as const;

function monthName(key: string) {
  return MESES[Number(key.slice(5, 7)) - 1];
}

/** Techo "redondo" del eje: 1, 1,2, 1,5, 2, 2,5, 3, 4, 5, 6, 8 × potencia de 10. */
function niceMax(value: number) {
  if (value <= 0) return 1;
  const mag = 10 ** Math.floor(Math.log10(value));
  const step = [1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10].find(
    (s) => s * mag >= value,
  );
  return (step ?? 10) * mag;
}

export function FlowChart({ data }: { data: MonthlyPoint[] }) {
  const [range, setRange] = useState<number>(6);
  const [hover, setHover] = useState<number | null>(null);

  const visible = useMemo(() => {
    if (range > 0) return data.slice(-range);
    // "Todo": desde el primer mes con movimientos.
    const first = data.findIndex((d) => d.ingresos > 0 || d.gastos > 0);
    return first === -1 ? data.slice(-6) : data.slice(first);
  }, [data, range]);

  const max = niceMax(
    Math.max(...visible.map((d) => Math.max(d.ingresos, d.gastos))),
  );
  const dense = visible.length > 12;
  const totalIn = visible.reduce((t, d) => t + d.ingresos, 0);
  const totalOut = visible.reduce((t, d) => t + d.gastos, 0);
  const shown = hover !== null ? visible[hover] : null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="eyebrow">Ingresos y gastos</span>
        <div
          role="group"
          aria-label="Período"
          className="inline-flex rounded-full bg-background/70 p-1 ring-1 ring-foreground/8"
        >
          {RANGES.map((r) => (
            <button
              key={r.label}
              type="button"
              aria-pressed={range === r.n}
              onClick={() => {
                setRange(r.n);
                setHover(null);
              }}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-bold transition-colors",
                range === r.n
                  ? "bg-ink text-on-ink"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <p
        aria-live="polite"
        className="flex min-h-5 flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs"
      >
        {shown ? (
          <>
            <span className="uppercase">
              {monthName(shown.month)} {shown.month.slice(0, 4)}
            </span>
            <Key color="var(--green)">{formatARS(shown.ingresos)}</Key>
            <Key color="var(--red)">{formatARS(shown.gastos)}</Key>
            <span>Quedó {formatARS(shown.ingresos - shown.gastos)}</span>
          </>
        ) : (
          <>
            <Key color="var(--green)">Ingresos {formatARS(totalIn)}</Key>
            <Key color="var(--red)">Gastos {formatARS(totalOut)}</Key>
            <span>Quedó {formatARS(totalIn - totalOut)}</span>
          </>
        )}
      </p>

      <div>
        <div
          className={cn(
            "relative flex h-44 items-end border-b-2 border-foreground/70",
            dense ? "gap-[1%]" : "gap-[2.2%]",
          )}
        >
          {[100, 50].map((p) => (
            <div
              key={p}
              className="pointer-events-none absolute inset-x-0 border-t border-dashed border-foreground/20"
              style={{ bottom: `${p}%` }}
            >
              <span className="absolute right-0 bottom-0.5 font-mono text-[10px] opacity-60">
                {formatCompactARS((max * p) / 100)}
              </span>
            </div>
          ))}
          {visible.map((d, i) => (
            <div
              key={`${range}-${d.month}`}
              className="relative z-[1] flex h-full flex-1 items-end"
              onPointerEnter={() => setHover(i)}
              onPointerLeave={() => setHover(null)}
            >
              <div
                className={cn(
                  "flex h-full w-full items-end",
                  dense ? "gap-0.5" : "gap-1",
                  hover !== null && hover !== i && "opacity-45",
                  "transition-opacity",
                )}
              >
                <i
                  className={cn(
                    "bar-grow block flex-1 rounded-t-lg",
                    dense && "rounded-t-[5px]",
                  )}
                  style={
                    {
                      height: `${(d.ingresos / max) * 100}%`,
                      "--k": dense ? i * 0.3 : i,
                      background:
                        "linear-gradient(180deg,color-mix(in srgb,var(--green) 70%,#fff),var(--green))",
                    } as React.CSSProperties
                  }
                />
                <i
                  className={cn(
                    "bar-grow block flex-1 rounded-t-lg",
                    dense && "rounded-t-[5px]",
                  )}
                  style={
                    {
                      height: `${(d.gastos / max) * 100}%`,
                      "--k": dense ? i * 0.3 : i,
                      background:
                        "linear-gradient(180deg,color-mix(in srgb,var(--red) 70%,#fff),var(--red))",
                    } as React.CSSProperties
                  }
                />
              </div>
            </div>
          ))}
        </div>
        <div
          className={cn(
            "mt-2 flex font-mono uppercase opacity-65",
            dense ? "gap-[1%] text-[9.5px]" : "gap-[2.2%] text-[11px]",
          )}
        >
          {visible.map((d, i) => {
            const jan = d.month.endsWith("-01");
            const show = !dense || i === 0 || jan || i % 3 === 0;
            return (
              <span
                key={d.month}
                className="min-w-0 flex-1 text-center whitespace-nowrap"
              >
                {show
                  ? `${monthName(d.month)}${dense && (i === 0 || jan) ? ` ${d.month.slice(2, 4)}` : ""}`
                  : ""}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Key({
  color,
  children,
}: {
  color: string;
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <i
        className="size-2.5 rounded-sm"
        style={{ background: color }}
        aria-hidden="true"
      />
      {children}
    </span>
  );
}
