import { ArrowLeftRight, Tags, BarChart3, TrendingUp, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const FEATURES = [
  {
    icon: ArrowLeftRight,
    title: "Ingresos y gastos",
    description:
      "Registrá cada movimiento con fecha, monto y descripción en segundos.",
  },
  {
    icon: Tags,
    title: "Categorías a tu medida",
    description:
      "Organizá tus transacciones con categorías propias, con color e ícono.",
  },
  {
    icon: BarChart3,
    title: "Dashboard claro",
    description:
      "Balance, gastos por categoría y tendencia mensual, de un vistazo.",
  },
  {
    icon: TrendingUp,
    title: "Inversiones",
    description:
      "Próximamente: organizá inversiones por nivel de riesgo y simulá rendimientos.",
    comingSoon: true,
  },
];

export function FeaturesSection() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((feature) => (
          <Card key={feature.title} className="relative">
            <CardContent className="flex flex-col gap-3">
              {feature.comingSoon ? (
                <span className="absolute top-4 right-4 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                  Próximamente
                </span>
              ) : null}
              <div className="flex size-9 items-center justify-center rounded-md bg-primary/10">
                <feature.icon className="size-4.5 text-primary" />
              </div>
              <h3 className="font-medium">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-10 flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <ShieldCheck className="size-4" />
        Tus datos son privados: cada cuenta solo ve su propia información.
      </div>
    </section>
  );
}
