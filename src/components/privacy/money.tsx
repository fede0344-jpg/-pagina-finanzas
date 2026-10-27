"use client";

import { usePrivacy } from "./privacy-provider";

/**
 * Envuelve un monto de plata: con el modo privado activo muestra puntitos en
 * su lugar. `mask` permite poner otra máscara (por ejemplo, una más grande).
 */
export function Money({
  children,
  mask,
}: {
  children: React.ReactNode;
  mask?: React.ReactNode;
}) {
  const { hidden } = usePrivacy();
  if (!hidden) return <>{children}</>;

  return (
    <span role="img" aria-label="Monto oculto" className="select-none">
      {mask ?? "••••••"}
    </span>
  );
}
