"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { signIn } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Ingresando..." : "Iniciar sesión"}
    </Button>
  );
}

export function LoginForm({ next }: { next?: string }) {
  const [state, formAction] = useActionState(signIn, null);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Bienvenido de nuevo</CardTitle>
        <CardDescription>
          Iniciá sesión para ver tu resumen financiero.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="flex flex-col gap-4">
          {next ? <input type="hidden" name="next" value={next} /> : null}
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </div>
          {state && "error" in state ? (
            <p role="alert" className="text-sm text-negative">
              {state.error}
            </p>
          ) : null}
          <SubmitButton />
        </form>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          ¿No tenés cuenta?{" "}
          <Link href="/signup" className="text-primary underline">
            Creá una
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
