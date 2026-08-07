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
      "Seguí cripto, CEDEARs, acciones y bonos por nivel de riesgo, con precio y rendimiento automáticos.",
  },
];

export function FeaturesSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <div className="mb-10 grid gap-4 border-b pb-10 md:grid-cols-2 md:gap-16">
        <h2 className="font-display text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl">
          Todo lo que necesitás para ordenar tu plata
        </h2>
        <p className="text-muted-foreground md:pt-2">
          Cargás lo que entra y lo que sale, y la app se encarga del resto:
          categorías, gráficos y el precio de tus inversiones al día.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((feature) => (
          <Card
            key={feature.title}
            className="transition-all duration-200 hover:-translate-y-1 hover:ring-primary/30 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          >
            <CardContent className="flex flex-col gap-3">
              <div className="flex size-9 items-center justify-center rounded-md bg-primary/10 transition-colors group-hover/card:bg-primary/20">
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
