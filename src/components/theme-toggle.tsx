"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

// El estado activo se pinta con CSS (`dark:`), así no depende de que el
// componente ya esté hidratado y no parpadea al cargar.
const BASE =
  "inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-bold transition-colors max-sm:px-2.5";

export function ThemeToggle({ className }: { className?: string }) {
  const { setTheme } = useTheme();

  return (
    <div
      role="group"
      aria-label="Tema"
      className={cn(
        "inline-flex rounded-full bg-card p-1 ring-1 ring-foreground/8",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => setTheme("light")}
        className={cn(
          BASE,
          "bg-ink text-on-ink dark:bg-transparent dark:text-muted-foreground dark:hover:text-foreground",
        )}
      >
        <Sun className="size-3.5" />
        <span className="max-sm:sr-only">Claro</span>
      </button>
      <button
        type="button"
        onClick={() => setTheme("dark")}
        className={cn(
          BASE,
          "text-muted-foreground hover:text-foreground dark:bg-ink dark:text-on-ink",
        )}
      >
        <Moon className="size-3.5" />
        <span className="max-sm:sr-only">Oscuro</span>
      </button>
    </div>
  );
}
