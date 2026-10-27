import { BalanceTile } from "@/components/dashboard/balance-tile";
import { StatTile } from "@/components/dashboard/stat-tile";
import { FlowChart } from "@/components/dashboard/flow-chart";
import { CategoryTile } from "@/components/dashboard/category-tile";
import { lastNMonthKeys } from "@/lib/utils/date-ranges";

// Datos de muestra: no son de nadie, solo muestran cómo se ve el tablero.
const INCOME = [
  450, 520, 480, 610, 560, 700, 640, 720, 690, 810, 760, 880, 840, 950, 900,
  1020, 980, 1100, 1050, 1320, 980, 1750, 1410, 2210,
];
const EXPENSE = [
  260, 300, 280, 340, 310, 380, 330, 360, 350, 420, 390, 410, 380, 440, 400,
  470, 430, 460, 420, 510, 390, 460, 440, 380,
];

const CATEGORIES = [
  { id: "a", name: "Alquiler", color: "#2f5bff", amount: 168000 },
  { id: "b", name: "Supermercado", color: "#16a36d", amount: 92000 },
  { id: "c", name: "Transporte", color: "#f2b84b", amount: 61000 },
  { id: "d", name: "Salidas", color: "#e5484d", amount: 38000 },
  { id: "e", name: "Suscripciones", color: "#8b5cf6", amount: 20700 },
];

const CURVE = [
  310, 380, 360, 520, 610, 590, 800, 920, 880, 1240, 1520, 1430, 1780, 2210,
].map((v) => v * 1000);

export function DashboardPreview() {
  const months = lastNMonthKeys(INCOME.length);
  const trend = months.map((month, i) => ({
    month,
    label: month,
    ingresos: INCOME[i] * 1000,
    gastos: EXPENSE[i] * 1000,
  }));

  return (
    <div className="grid gap-4 lg:grid-cols-12" aria-label="Ejemplo del tablero">
      <BalanceTile balance={2210800} curve={CURVE} savingsRate={71} />

      <div className="grid gap-4 sm:grid-cols-2 lg:col-span-5">
        <StatTile kind="ing" index={1} label="Ingresos del mes" amount={1320000} />
        <StatTile kind="gas" index={2} label="Gastos del mes" amount={379700} />
        <StatTile
          kind="aho"
          index={3}
          className="sm:col-span-2"
          label="Ahorro del mes"
          amount={940300}
          hint="+71% del ingreso"
        />
      </div>

      <section
        className="tile tilt lg:col-span-7"
        style={{ "--i": 4 } as React.CSSProperties}
      >
        <FlowChart data={trend} />
      </section>
      <CategoryTile data={CATEGORIES} />
    </div>
  );
}
