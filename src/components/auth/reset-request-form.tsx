"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { requestPasswordReset } from "@/lib/actions/auth";
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
      {pending ? "Enviando..." : "Enviarme el enlace"}
    </Button>
  );
}

export function ResetRequestForm() {
  const [state, formAction] = useActionState(requestPasswordReset, null);

  if (state && "success" in state) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="display text-2xl">Revisá tu correo</CardTitle>
          <CardDescription>
            Si ese email tiene una cuenta, te mandamos un enlace para elegir
            una contraseña nueva. El enlace vence en una hora.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link
            href="/login"
            className="text-sm text-primary underline underline-offset-4"
          >
            Volver a iniciar sesión
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="display text-2xl">Recuperar contraseña</CardTitle>
        <CardDescription>
          Escribí tu email y te mandamos un enlace para crear una nueva.
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
          {state && "error" in state ? (
            <p role="alert" className="text-sm text-negative">
              {state.error}
            </p>
          ) : null}
          <SubmitButton />
        </form>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          ¿Te acordaste?{" "}
          <Link href="/login" className="text-primary underline">
            Iniciá sesión
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
