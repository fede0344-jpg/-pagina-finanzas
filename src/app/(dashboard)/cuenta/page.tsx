import { getCurrentUser } from "@/lib/supabase/auth";
import { PageHeader } from "@/components/layout/page-header";
import { PasswordForm } from "@/components/auth/password-form";
import { Card, CardContent } from "@/components/ui/card";

export default async function CuentaPage() {
  const user = await getCurrentUser();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Mi cuenta"
        description="Tus datos de acceso a Financitas."
      />

      <Card>
        <CardContent className="flex flex-col gap-1">
          <span className="text-sm text-muted-foreground">Email</span>
          <span className="font-medium">{user?.email}</span>
        </CardContent>
      </Card>

      <div className="reveal">
        <PasswordForm
          title="Cambiar contraseña"
          description="Elegí una contraseña nueva para entrar a tu cuenta."
          submitLabel="Cambiar contraseña"
        />
      </div>
    </div>
  );
}
