import Link from "next/link";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/inversiones", label: "Mercado" },
  { href: "/inversiones/compras", label: "Mis compras" },
] as const;

/** Pestañas de la sección Inversiones (son páginas distintas). */
export function InvestmentsTabs({
  active,
}: {
  active: (typeof TABS)[number]["href"];
}) {
  return (
    <nav
      aria-label="Secciones de inversiones"
      className="inline-flex w-fit rounded-full bg-card p-1 ring-1 ring-foreground/8"
    >
      {TABS.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          aria-current={tab.href === active ? "page" : undefined}
          className={cn(
            "rounded-full px-4 py-1.5 text-sm font-bold transition-colors",
            tab.href === active
              ? "bg-ink text-on-ink"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
