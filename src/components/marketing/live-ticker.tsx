"use client";

import { useCallback, useEffect, useState } from "react";
import { refreshTicker } from "@/lib/actions/ticker";
import { formatARS, formatCurrency } from "@/lib/utils/format";
import { cn } from "@/lib/utils";
import type { TickerItem } from "@/lib/market-data/ticker";

const REFRESH_MS = 60_000;

// En pantallas chicas el ticker se queda con lo más representativo para
// no empujar el título tres renglones hacia abajo.
const MOBILE_LABELS = new Set(["Dólar blue", "Bitcoin"]);

type Direction = "up" | "down" | null;

function formatValue(item: TickerItem): string {
  return item.currency === "ARS"
    ? formatARS(item.value)
    : formatCurrency(item.value);
}

export function LiveTicker({ initialItems }: { initialItems: TickerItem[] }) {
  const [items, setItems] = useState(initialItems);
  const [directions, setDirections] = useState<Record<string, Direction>>({});
  const [flashKey, setFlashKey] = useState(0);

  const refresh = useCallback(() => {
    refreshTicker()
      .then((fresh) => {
        if (fresh.length === 0) return;
        setItems((prev) => {
          const next: Record<string, Direction> = {};
          for (const item of fresh) {
            const before = prev.find((p) => p.label === item.label);
            if (before && before.value !== item.value) {
              next[item.label] = item.value > before.value ? "up" : "down";
            }
          }
          setDirections(next);
          setFlashKey((k) => k + 1);
          return fresh;
        });
      })
      .catch(() => {
        // si falla, seguimos mostrando el último dato conocido
      });
  }, []);

  useEffect(() => {
    const interval = setInterval(refresh, REFRESH_MS);
    return () => clearInterval(interval);
  }, [refresh]);

  if (items.length === 0) return null;

  return (
    <div className="flex w-fit flex-wrap items-center justify-center gap-x-5 gap-y-1.5 rounded-3xl bg-card px-4 py-2.5 text-sm ring-1 ring-foreground/8 lg:justify-start">
      <span className="eyebrow flex items-center gap-1.5 text-muted-foreground">
        <span className="live-dot size-1.5 rounded-full bg-positive" />
        En vivo
      </span>
      {items.map((item) => (
        <span
          key={item.label}
          className={cn(
            "items-baseline gap-1.5 sm:flex",
            MOBILE_LABELS.has(item.label) ? "flex" : "hidden",
          )}
        >
          <span className="font-mono text-xs text-muted-foreground">{item.label}</span>
          <span
            key={`${item.label}-${flashKey}`}
            className={cn(
              "font-medium tabular-nums transition-colors",
              directions[item.label] === "up" && "flash-up",
              directions[item.label] === "down" && "flash-down",
            )}
          >
            {formatValue(item)}
          </span>
          {item.changePercent !== null ? (
            <span
              className={cn(
                "text-xs tabular-nums",
                item.changePercent >= 0 ? "text-positive" : "text-negative",
              )}
            >
              {item.changePercent >= 0 ? "+" : ""}
              {item.changePercent.toFixed(1)}%
            </span>
          ) : null}
        </span>
      ))}
    </div>
  );
}
