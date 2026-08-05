"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Tags,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/transacciones", label: "Transacciones", icon: ArrowLeftRight },
  { href: "/categorias", label: "Categorías", icon: Tags },
  {
    href: "/inversiones",
    label: "Inversiones",
    icon: TrendingUp,
    badge: "Próximamente",
  },
] as const;

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 border-r bg-card md:flex md:flex-col">
      <div className="flex h-14 items-center border-b px-5">
        <Link href="/dashboard" className="font-semibold tracking-tight">
          Finanzas
        </Link>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-3">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="size-4" />
              {item.label}
              {"badge" in item && item.badge ? (
                <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-[10px] font-normal text-muted-foreground">
                  {item.badge}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
