import { CalculatorTabs } from "@/components/calculator/calculator-tabs";

export default function CalculadoraPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold">Calculadoras</h1>
        <p className="text-sm text-muted-foreground">
          Estimá el crecimiento de una inversión con aportes constantes, o
          proyectá el rendimiento a partir de un precio objetivo.
        </p>
      </div>
      <CalculatorTabs />
    </div>
  );
}
