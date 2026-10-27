import Link from "next/link";
import { ArrowUpRight, ShieldCheck } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LiveTicker } from "./live-ticker";
import { DashboardPreview } from "./dashboard-preview";
import { getTickerItems } from "@/lib/market-data/ticker";

// Datos verificables sobre cómo funciona la app, no métricas inventadas.
const FACTS = [
  { label: "Crear cuenta", value: "Gratis, sin tarjeta" },
  { label: "Precios", value: "CoinGecko · BYMA · dolarapi" },
  { label: "Se actualizan", value: "Cada 60 segundos" },
  { label: "Tus datos", value: "Privados por cuenta" },
];

export async function Hero() {
  const tickerItems = await getTickerItems();

  return (
    <section className="mx-auto w-full max-w-[1320px] px-4 pt-10 pb-12 md:px-8 md:pt-16">
      <div className="flex flex-col items-start gap-7">
        <LiveTicker initialItems={tickerItems} />

        <h1 className="display max-w-5xl text-[clamp(2.5rem,8vw,6.6rem)] leading-[0.96] text-balance">
          Tus gastos y tus inversiones, en un solo lugar
        </h1>

        <div className="flex w-full flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <p className="max-w-xl text-lg text-muted-foreground text-balance">
            Registrá ingresos y gastos en segundos, y seguí cripto, CEDEARs,
            acciones y bonos con precios que se actualizan solos. Sin
            planillas, sin cargar nada a mano.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/signup"
              className={cn(buttonVariants({ size: "lg" }), "group px-7")}
            >
              Crear cuenta gratis
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none" />
            </Link>
            <Link
              href="/login"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "px-7",
              )}
            >
              Iniciar sesión
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-12 md:mt-16">
        <p className="eyebrow mb-3 text-muted-foreground">
          Así se ve · datos de ejemplo, tocá y mové el mouse
        </p>
        <DashboardPreview />
      </div>

      <div className="mt-6 flex items-start gap-2.5 rounded-2xl bg-card px-4 py-3 text-sm text-muted-foreground ring-1 ring-foreground/8">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
        <span>
          Nunca te pedimos acceso al banco ni a tus tarjetas. Cada cuenta ve
          solamente su propia información.
        </span>
      </div>

      <dl className="mt-10 grid gap-6 border-t border-foreground/10 pt-8 sm:grid-cols-2 lg:grid-cols-4">
        {FACTS.map((fact) => (
          <div key={fact.label} className="flex flex-col gap-1">
            <dt className="eyebrow text-muted-foreground">{fact.label}</dt>
            <dd className="text-sm font-semibold">{fact.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
