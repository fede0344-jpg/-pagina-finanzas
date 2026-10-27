import {
  LayoutDashboard,
  ArrowLeftRight,
  Tags,
  TrendingUp,
  PieChart,
  Calculator,
} from "lucide-react";

// `shortLabel` es el texto de la barra inferior del celular, donde hay
// menos lugar por botón.
export const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", shortLabel: "Inicio", icon: LayoutDashboard },
  { href: "/transacciones", label: "Transacciones", shortLabel: "Movim.", icon: ArrowLeftRight },
  { href: "/categorias", label: "Categorías", shortLabel: "Categ.", icon: Tags },
  { href: "/inversiones", label: "Inversiones", shortLabel: "Invertir", icon: TrendingUp },
  { href: "/portafolio", label: "Portafolio", shortLabel: "Cartera", icon: PieChart },
  { href: "/calculadora", label: "Calculadora", shortLabel: "Calcular", icon: Calculator },
] as const;
