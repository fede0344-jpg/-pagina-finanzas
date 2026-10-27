import { z } from "zod";

// Acepta formatos argentinos: "1.500,50", "1500,5", "1.500" (= mil quinientos).
export function parseAmount(raw: string): number {
  const value = raw.trim().replace(/\s/g, "");
  if (/^\d{1,3}(\.\d{3})+(,\d+)?$/.test(value)) {
    return Number(value.replace(/\./g, "").replace(",", "."));
  }
  return Number(value.replace(",", "."));
}

export const portfolioSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "El nombre es obligatorio.")
    .max(40, "Máximo 40 caracteres."),
  amount: z
    .string()
    .transform(parseAmount)
    .pipe(
      z
        .number({ message: "Ingresá un monto válido." })
        .positive("El monto debe ser mayor a 0.")
        .max(1_000_000_000_000, "El monto es demasiado grande."),
    ),
  currency: z.enum(["ARS", "USD"], { message: "Elegí pesos o dólares." }),
});

export type PortfolioInput = z.infer<typeof portfolioSchema>;
