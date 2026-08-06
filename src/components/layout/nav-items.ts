import {
  LayoutDashboard,
  ArrowLeftRight,
  Tags,
  TrendingUp,
  Calculator,
} from "lucide-react";

export const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/transacciones", label: "Transacciones", icon: ArrowLeftRight },
  { href: "/categorias", label: "Categorías", icon: Tags },
  { href: "/inversiones", label: "Inversiones", icon: TrendingUp },
  { href: "/calculadora", label: "Calculadora", icon: Calculator },
] as const;
