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
    <section className="mx-auto max-w-6xl px-4 pt-12 pb-16 sm:pt-16">
      <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
        <div className="flex flex-col items-center gap-6 text-center lg:items-start lg:text-left">
          <LiveTicker initialItems={tickerItems} />

          <h1 className="font-display text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            Tus gastos y tus inversiones, en un solo lugar
          </h1>

          <p className="max-w-lg text-lg text-muted-foreground text-balance">
            Registrá ingresos y gastos en segundos, y seguí cripto, CEDEARs,
            acciones y bonos con precios que se actualizan solos. Sin
            planillas, sin cargar nada a mano.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/signup"
              className={cn(buttonVariants({ size: "lg" }), "group gap-2 px-6")}
            >
              Crear cuenta gratis
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none" />
            </Link>
            <Link
              href="/login"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "px-6",
              )}
            >
              Iniciar sesión
            </Link>
          </div>

          <div className="flex max-w-md items-start gap-2.5 rounded-lg border bg-card/60 px-4 py-3 text-left text-sm text-muted-foreground backdrop-blur-sm">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
            <span>
              Nunca te pedimos acceso al banco ni a tus tarjetas. Cada cuenta
              ve solamente su propia información.
            </span>
          </div>
        </div>

        <div className="[perspective:1600px]">
          <div className="relative">
            <div
              aria-hidden
              className="absolute -inset-6 -z-10 rounded-[2rem] bg-primary/20 blur-3xl"
            />
            <DashboardPreview className="w-full origin-center transition-transform duration-500 lg:[transform:rotateY(-9deg)_rotateX(3deg)] lg:hover:[transform:rotateY(-4deg)_rotateX(1deg)] motion-reduce:transition-none" />
          </div>
        </div>
      </div>

      <dl className="mt-14 grid gap-6 border-t pt-8 sm:grid-cols-2 lg:grid-cols-4">
        {FACTS.map((fact) => (
          <div key={fact.label} className="flex flex-col gap-1">
            <dt className="text-xs text-muted-foreground">{fact.label}</dt>
            <dd className="text-sm font-medium">{fact.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
