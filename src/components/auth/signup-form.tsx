"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { signUp } from "@/lib/actions/auth";
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
      {pending ? "Creando cuenta..." : "Crear cuenta"}
    </Button>
  );
}

export function SignupForm() {
  const [state, formAction] = useActionState(signUp, null);

  if (state && "success" in state) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Revisá tu email</CardTitle>
          <CardDescription>
            Te enviamos un enlace de confirmación. Abrilo para activar tu
            cuenta.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Creá tu cuenta</CardTitle>
        <CardDescription>
          Empezá a organizar tus ingresos y gastos gratis.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="flex flex-col gap-4">
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
              autoComplete="new-password"
              minLength={8}
              required
            />
            <p className="text-xs text-muted-foreground">
              Mínimo 8 caracteres.
            </p>
          </div>
          {state && "error" in state ? (
            <p role="alert" className="text-sm text-negative">
              {state.error}
            </p>
          ) : null}
          <SubmitButton />
        </form>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          ¿Ya tenés cuenta?{" "}
          <Link href="/login" className="text-primary underline">
            Iniciá sesión
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
