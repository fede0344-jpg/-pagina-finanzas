import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CtaSection() {
  return (
    <section className="mx-auto w-full max-w-[1320px] px-4 pt-8 pb-20 md:px-8">
      <div className="tile tile-cel tilt flex flex-col items-start gap-6 p-8 md:p-14">
        <h2 className="display max-w-3xl text-4xl leading-[0.98] text-balance sm:text-6xl">
          Empezá a organizar tus finanzas hoy
        </h2>
        <p className="max-w-md text-on-cel/80">
          Crear una cuenta toma menos de un minuto.
        </p>
        <Link
          href="/signup"
          className={cn(
            buttonVariants({ size: "lg" }),
            "group bg-on-cel px-7 text-cel hover:bg-on-cel/90",
          )}
        >
          Crear cuenta gratis
          <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
    </section>
  );
}
