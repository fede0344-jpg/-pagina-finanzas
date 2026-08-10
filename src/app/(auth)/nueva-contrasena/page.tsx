import { PasswordForm } from "@/components/auth/password-form";

export default function NuevaContrasenaPage() {
  return (
    <PasswordForm
      title="Elegí una contraseña nueva"
      description="Vas a poder entrar con ella la próxima vez."
      submitLabel="Guardar contraseña"
      showLoginLink
    />
  );
}
