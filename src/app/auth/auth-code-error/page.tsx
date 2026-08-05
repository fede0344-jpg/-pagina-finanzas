import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function AuthCodeErrorPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-4 text-center">
      <h1 className="text-xl font-semibold">
        El enlace no es válido o expiró
      </h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        Pedí un nuevo enlace de confirmación o iniciá sesión nuevamente.
      </p>
      <Link href="/login" className={buttonVariants({ variant: "default" })}>
        Volver a iniciar sesión
      </Link>
    </main>
  );
}
