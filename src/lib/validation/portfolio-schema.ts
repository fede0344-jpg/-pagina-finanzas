import { z } from "zod";

// Acepta formatos argentinos: "1.500,50", "1500,5", "1.500" (= mil quinientos).
export function parseAmount(raw: string): number {
  const value = raw.trim().replace(/\s/g, "");
  if (/^\d{1,3}(\.\d{3})+(,\d+)?$/.test(value)) {
    return Number(value.replace(/\./g, "").replace(",", "."));
  }
  return Number(value.replace(",", "."));
}

// Cantidades: "0.5" y "0,5" son medio; "1.500,25" es mil quinientos con 25.
// A diferencia de los montos, un solo punto cuenta como decimal (0.025 BTC).
export function parseQuantity(raw: string): number {
  const value = raw.trim().replace(/\s/g, "");
  if (value.includes(",")) {
    return Number(value.replace(/\./g, "").replace(",", "."));
  }
  return Number(value);
}

const nameField = z
  .string()
  .trim()
  .min(1, "El nombre es obligatorio.")
  .max(40, "Máximo 40 caracteres.");

const amountPosition = z.object({
  mode: z.literal("amount"),
  name: nameField,
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

const quantityPosition = z.object({
  mode: z.literal("quantity"),
  name: nameField,
  asset_type: z.enum(["crypto", "cedear", "accion_arg", "bono_arg"], {
    message: "Elegí un tipo de activo.",
  }),
  symbol: z
    .string()
    .trim()
    .min(1, "El símbolo es obligatorio.")
    .max(20, "Máximo 20 caracteres."),
  quantity: z
    .string()
    .transform(parseQuantity)
    .pipe(
      z
        .number({ message: "Ingresá una cantidad válida." })
        .positive("La cantidad debe ser mayor a 0.")
        .max(1_000_000_000_000, "La cantidad es demasiado grande."),
    ),
});

export const portfolioSchema = z.discriminatedUnion("mode", [
  amountPosition,
  quantityPosition,
]);

export type PortfolioInput = z.infer<typeof portfolioSchema>;
