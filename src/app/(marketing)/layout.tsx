import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-16 items-center justify-between border-b px-4 sm:px-6">
        <Link href="/" className="font-semibold tracking-tight">
          Finanzas
        </Link>
        <nav className="flex items-center gap-2">
          <Link
            href="/login"
            className={cn(buttonVariants({ variant: "ghost" }))}
          >
            Iniciar sesión
          </Link>
          <Link href="/signup" className={cn(buttonVariants())}>
            Crear cuenta
          </Link>
        </nav>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t px-4 py-8 text-center text-sm text-muted-foreground sm:px-6">
        © {new Date().getFullYear()} Finanzas. Proyecto personal.
      </footer>
    </div>
  );
}
