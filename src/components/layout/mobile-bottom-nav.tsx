"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "./nav-items";

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-foreground/8 bg-background/90 px-1 pt-1 pb-[max(0.25rem,env(safe-area-inset-bottom))] backdrop-blur-md lg:hidden">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className="flex flex-1 flex-col items-center gap-0.5 py-1 text-[11px] font-semibold"
          >
            <span
              className={cn(
                "flex h-7 w-12 items-center justify-center rounded-full transition-colors",
                isActive ? "bg-ink text-on-ink" : "text-muted-foreground",
              )}
            >
              <Icon className="size-[18px]" />
            </span>
            <span
              className={isActive ? "text-foreground" : "text-muted-foreground"}
            >
              {item.shortLabel}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
