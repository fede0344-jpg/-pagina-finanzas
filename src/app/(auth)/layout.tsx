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
import { GradientBackdrop } from "@/components/marketing/gradient-backdrop";

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

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative grid min-h-screen lg:grid-cols-2">
      <GradientBackdrop />
      <Link
        href="/"
        className="absolute top-4 left-4 z-10 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Volver al inicio
      </Link>
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>
      <section className="hidden flex-col justify-center gap-12 px-16 py-16 lg:flex">
        <Link href="/">
          <Logo textClassName="text-2xl" markClassName="size-11" />
        </Link>
        <div className="flex flex-col gap-5">
          <h1 className="font-display max-w-lg text-5xl font-semibold tracking-tight text-balance">
            Tus finanzas e inversiones, en un solo lugar
          </h1>
          <p className="max-w-md text-xl text-muted-foreground text-balance">
            Organizá tus ingresos y gastos, y seguí tus inversiones con
            precios y gráficos que se actualizan solos.
          </p>
        </div>
        <ul className="flex flex-col gap-6">
          {HIGHLIGHTS.map((item) => (
            <li key={item.text} className="flex items-center gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <item.icon className="size-5 text-primary" />
              </div>
              <span className="text-lg text-foreground">{item.text}</span>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2 text-base text-muted-foreground">
          <ShieldCheck className="size-5" />
          Tus datos son privados: cada cuenta solo ve su propia información.
        </div>
      </section>

      <section className="flex flex-col items-center justify-center gap-6 p-4">
        <Link href="/" className="lg:hidden">
          <Logo textClassName="text-lg" markClassName="size-8" />
        </Link>
        <div className="w-full max-w-sm">{children}</div>
      </section>
    </main>
  );
}
