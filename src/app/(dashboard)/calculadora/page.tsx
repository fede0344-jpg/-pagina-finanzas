import { CalculatorTabs } from "@/components/calculator/calculator-tabs";
import { PageHeader } from "@/components/layout/page-header";

export default function CalculadoraPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Calculadoras"
        description="Estimá el crecimiento de una inversión con aportes constantes, o proyectá el rendimiento a partir de un precio objetivo."
      />
      <CalculatorTabs />
    </div>
  );
}
