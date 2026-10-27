"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { updatePassword } from "@/lib/actions/auth";
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

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Guardando..." : label}
    </Button>
  );
}

export function PasswordForm({
  title,
  description,
  submitLabel,
  showLoginLink = false,
}: {
  title: string;
  description: string;
  submitLabel: string;
  showLoginLink?: boolean;
}) {
  const [state, formAction] = useActionState(updatePassword, null);
  const done = state !== null && "success" in state;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="display text-2xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {done ? (
          <div className="flex flex-col items-start gap-3">
            <p className="text-sm text-positive">
              Listo, tu contraseña quedó actualizada.
            </p>
            {showLoginLink ? (
              <Link
                href="/login"
                className="text-sm text-primary underline underline-offset-4"
              >
                Iniciar sesión
              </Link>
            ) : null}
          </div>
        ) : (
          <form action={formAction} className="flex max-w-sm flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Contraseña nueva</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
              />
              <p className="text-xs text-muted-foreground">
                Al menos 8 caracteres.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password_confirmation">Repetila</Label>
              <Input
                id="password_confirmation"
                name="password_confirmation"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
              />
            </div>
            {state && "error" in state ? (
              <p role="alert" className="text-sm text-negative">
                {state.error}
              </p>
            ) : null}
            <SubmitButton label={submitLabel} />
          </form>
        )}
      </CardContent>
    </Card>
  );
}
