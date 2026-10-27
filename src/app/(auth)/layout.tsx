import Link from "next/link";
import {
  ArrowLeft,
  ArrowLeftRight,
  BarChart3,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { LiveTicker } from "@/components/marketing/live-ticker";
import { getTickerItems } from "@/lib/market-data/ticker";

const HIGHLIGHTS = [
  {
    icon: ArrowLeftRight,
    text: "Registrá tus ingresos y gastos en segundos.",
  },
  {
    icon: BarChart3,
    text: "Mirá tu balance y tus gastos por categoría de un vistazo.",
  },
  {
    icon: TrendingUp,
    text: "Seguí cripto, CEDEARs, acciones y bonos por nivel de riesgo.",
  },
];

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const tickerItems = await getTickerItems();

  return (
    <main className="relative grid min-h-screen lg:grid-cols-[1.1fr_1fr]">
      <Link
        href="/"
        className="group absolute top-4 left-4 z-10 flex items-center gap-1.5 rounded-full bg-card px-3.5 py-2 text-xs font-bold ring-1 ring-foreground/8 hover:text-primary lg:top-6 lg:left-8"
      >
        <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5 motion-reduce:transition-none" />
        Inicio
      </Link>
      <div className="absolute top-4 right-4 z-10 lg:top-6 lg:right-8">
        <ThemeToggle />
      </div>

      <section className="hidden flex-col justify-center gap-9 px-10 py-24 xl:px-16 lg:flex">
        <Link href="/" className="w-fit">
          <Logo textClassName="display text-2xl" markClassName="size-11" />
        </Link>

        <LiveTicker initialItems={tickerItems} />

        <div className="flex flex-col gap-5">
          <h1 className="display max-w-xl text-5xl leading-[0.98] text-balance xl:text-6xl">
            Tus finanzas e inversiones, en un solo lugar
          </h1>
          <p className="max-w-md text-lg text-muted-foreground text-balance">
            Organizá tus ingresos y gastos, y seguí tus inversiones con
            precios y gráficos que se actualizan solos.
          </p>
        </div>

        <ul className="flex flex-col gap-4">
          {HIGHLIGHTS.map((item) => (
            <li key={item.text} className="flex items-center gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-cel text-on-cel">
                <item.icon className="size-5" />
              </div>
              <span className="font-medium">{item.text}</span>
            </li>
          ))}
        </ul>

        <div className="flex max-w-lg items-start gap-2.5 rounded-2xl bg-card px-4 py-3 text-sm text-muted-foreground ring-1 ring-foreground/8">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
          <span>
            Nunca te pedimos acceso al banco ni a tus tarjetas. Cada cuenta ve
            solamente su propia información.
          </span>
        </div>
      </section>

      <section className="flex flex-col items-center justify-center gap-6 px-4 pt-20 pb-10 lg:px-10 lg:py-10">
        <Link href="/" className="lg:hidden">
          <Logo textClassName="display text-lg" markClassName="size-8" />
        </Link>
        <div className="w-full max-w-md">{children}</div>
      </section>
    </main>
  );
}
