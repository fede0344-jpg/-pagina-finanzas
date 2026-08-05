import { TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function InversionesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold">Inversiones</h1>
        <p className="text-sm text-muted-foreground">
          Organizá tus inversiones por nivel de riesgo.
        </p>
      </div>
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
            <TrendingUp className="size-6 text-primary" />
          </div>
          <h2 className="text-lg font-medium">Próximamente</h2>
          <p className="max-w-md text-sm text-muted-foreground">
            Vas a poder cargar tus activos por riesgo (bajo, medio, alto),
            ver su evolución histórica y simular cuánto podrías obtener
            invirtiendo un monto durante un plazo determinado, en base a
            rendimientos pasados.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
