"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { buttonVariants } from "@/components/ui/button";

export default function ConfirmedPage() {
  const [status, setStatus] = useState<"loading" | "error">("loading");
  const router = useRouter();

  useEffect(() => {
    async function confirmSession() {
      const hash = window.location.hash.startsWith("#")
        ? window.location.hash.slice(1)
        : window.location.hash;
      const params = new URLSearchParams(hash);
      const accessToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");

      if (!accessToken || !refreshToken) {
        throw new Error("missing tokens");
      }

      const supabase = createClient();
      const { error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
      if (error) throw error;

      router.push("/dashboard");
    }

    confirmSession().catch(() => setStatus("error"));
  }, [router]);

  if (status === "error") {
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

  return (
    <main className="flex min-h-screen items-center justify-center p-4 text-center">
      <p className="text-sm text-muted-foreground">Confirmando tu cuenta…</p>
    </main>
  );
}
