"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { NAV_ITEMS } from "./nav-items";
import { UserMenu } from "./user-menu";

export function TopNav({ email }: { email: string }) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-foreground/6 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-[1320px] items-center gap-4 px-4 md:px-8">
        <Link href="/dashboard" className="shrink-0">
          <Logo textClassName="display text-lg" />
        </Link>

        <nav className="ml-4 hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "rounded-full px-3.5 py-2 text-sm font-semibold transition-colors",
                  isActive
                    ? "bg-ink text-on-ink"
                    : "text-muted-foreground hover:bg-card hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <UserMenu email={email} />
        </div>
      </div>
    </header>
  );
}
