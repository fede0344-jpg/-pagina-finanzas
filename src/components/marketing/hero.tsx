import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Hero() {
  return (
    <section className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-4 pt-20 pb-16 text-center sm:pt-28">
      <span className="rounded-full border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground">
        Gratis para empezar
      </span>
      <h1 className="font-display text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
        Controlá tus gastos y seguí tus inversiones, todo en un solo lugar
      </h1>
      <p className="max-w-xl text-lg text-muted-foreground text-balance">
        Registrá ingresos y gastos en segundos, y mirá cripto, CEDEARs,
        acciones y bonos con precios que se actualizan solos. Sin planillas,
        sin cargar nada a mano.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/signup"
          className={cn(buttonVariants({ size: "lg" }), "px-6")}
        >
          Crear cuenta gratis
        </Link>
        <Link
          href="/login"
          className={cn(buttonVariants({ variant: "outline", size: "lg" }), "px-6")}
        >
          Iniciar sesión
        </Link>
      </div>
    </section>
  );
}
