import Link from "next/link";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-foreground/6 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-[1320px] items-center gap-3 px-4 md:px-8">
          <Link href="/">
            <Logo textClassName="display text-lg" />
          </Link>
          <nav className="ml-6 hidden items-center gap-1 md:flex">
            <a
              href="#funciones"
              className="rounded-full px-3.5 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
            >
              Funciones
            </a>
            <a
              href="#preguntas"
              className="rounded-full px-3.5 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
            >
              Preguntas
            </a>
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/login"
              className={cn(
                buttonVariants({ size: "default" }),
                "bg-ink text-on-ink hover:bg-ink/90 max-sm:hidden",
              )}
            >
              Iniciar sesión
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-foreground/8">
        <div className="mx-auto flex w-full max-w-[1320px] flex-col items-start justify-between gap-4 px-4 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:px-8">
          <Logo markClassName="size-6" textClassName="display text-base text-foreground" />
          <span>© {new Date().getFullYear()} Financitas. Proyecto personal.</span>
          <nav className="flex items-center gap-5">
            <Link href="/privacidad" className="hover:text-foreground">
              Privacidad
            </Link>
            <Link href="/terminos" className="hover:text-foreground">
              Términos
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
