import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CtaSection() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 text-center">
      <div className="rounded-2xl border bg-card px-6 py-12">
        <h2 className="text-2xl font-semibold text-balance">
          Empezá a organizar tus finanzas hoy
        </h2>
        <p className="mt-2 text-muted-foreground">
          Crear una cuenta toma menos de un minuto.
        </p>
        <Link
          href="/signup"
          className={cn(buttonVariants({ size: "lg" }), "mt-6 px-6")}
        >
          Crear cuenta gratis
        </Link>
      </div>
    </section>
  );
}
