import {
  ArrowLeftRight,
  Tags,
  BarChart3,
  TrendingUp,
  PieChart,
  Calculator,
} from "lucide-react";
import { cn } from "@/lib/utils";

const FEATURES = [
  {
    icon: ArrowLeftRight,
    title: "Ingresos y gastos",
    description:
      "Registrá cada movimiento con fecha, monto y descripción en segundos.",
    tile: "lg:col-span-5",
  },
  {
    icon: Tags,
    title: "Categorías a tu medida",
    description:
      "Organizá tus transacciones con categorías propias, con color e ícono.",
    tile: "lg:col-span-4 tile-soft",
  },
  {
    icon: BarChart3,
    title: "Tablero claro",
    description:
      "Balance, gastos por categoría y tendencia mensual, de un vistazo.",
    tile: "lg:col-span-3",
  },
  {
    icon: TrendingUp,
    title: "Inversiones por riesgo",
    description:
      "Seguí cripto, CEDEARs, acciones y bonos por nivel de riesgo, con precio y rendimiento automáticos.",
    tile: "lg:col-span-5 tile-cel",
  },
  {
    icon: PieChart,
    title: "Tu portafolio",
    description:
      "Cargá cuánto tenés en cada activo y mirá el porcentaje de cada uno en un gráfico de torta.",
    tile: "lg:col-span-4 tile-sol",
  },
  {
    icon: Calculator,
    title: "Calculadoras",
    description:
      "Interés compuesto y precio objetivo para proyectar antes de decidir.",
    tile: "lg:col-span-3 tile-ink",
  },
];

export function FeaturesSection() {
  return (
    <section
      id="funciones"
      className="mx-auto w-full max-w-[1320px] scroll-mt-20 px-4 py-16 md:px-8"
    >
      <div className="mb-10 grid gap-4 md:grid-cols-2 md:gap-16">
        <h2 className="display text-4xl leading-[1] text-balance sm:text-5xl">
          Todo para ordenar tu plata
        </h2>
        <p className="text-muted-foreground md:pt-3">
          Cargás lo que entra y lo que sale, y la app se encarga del resto:
          categorías, gráficos y el precio de tus inversiones al día.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-12">
        {FEATURES.map((feature, i) => (
          <section
            key={feature.title}
            className={cn(
              "tile tilt flex min-h-52 flex-col justify-between gap-8",
              feature.tile,
            )}
            style={{ "--i": i } as React.CSSProperties}
          >
            <feature.icon className="size-7" strokeWidth={1.75} />
            <div className="flex flex-col gap-2">
              <h3 className="display text-2xl leading-tight">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
