import Link from "next/link";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { GradientBackdrop } from "@/components/marketing/gradient-backdrop";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <GradientBackdrop />
      <header className="flex h-16 items-center justify-between border-b px-4 sm:px-6">
        <Link href="/">
          <Logo />
        </Link>
        <ThemeToggle />
      </header>
      <main className="flex-1">{children}</main>
      <footer className="flex flex-col items-center gap-3 border-t px-4 py-8 text-sm text-muted-foreground sm:px-6">
        <Logo markClassName="size-5" textClassName="text-sm" />
        <span>© {new Date().getFullYear()} Financitas. Proyecto personal.</span>
        <nav className="flex items-center gap-4">
          <Link href="/privacidad" className="hover:text-foreground">
            Privacidad
          </Link>
          <Link href="/terminos" className="hover:text-foreground">
            Términos
          </Link>
        </nav>
      </footer>
    </div>
  );
}
