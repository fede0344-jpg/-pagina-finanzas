import { z } from "zod";
import { parseAmount } from "./portfolio-schema";

// Cantidades: "0.06" y "0,06" son lo mismo; "1.500,25" es mil quinientos con 25.
// A diferencia de los montos, un solo punto cuenta como decimal (0.025 BTC).
function parseQuantity(raw: string): number {
  const value = raw.trim().replace(/\s/g, "");
  if (value.includes(",")) {
    return Number(value.replace(/\./g, "").replace(",", "."));
  }
  return Number(value);
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

const common = z.object({
  name: z
    .string()
    .trim()
    .min(1, "El nombre es obligatorio.")
    .max(60, "Máximo 60 caracteres."),
  asset_type: z.enum(["crypto", "cedear", "accion_arg", "bono_arg"], {
    message: "Elegí un tipo de activo.",
  }),
  symbol: z
    .string()
    .trim()
    .min(1, "El símbolo es obligatorio.")
    .max(20, "Máximo 20 caracteres."),
  purchase_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Elegí la fecha de la compra.")
    .refine((d) => !Number.isNaN(Date.parse(d)), "La fecha no es válida.")
    .refine((d) => d <= todayIso(), "La fecha no puede ser futura.")
    .refine((d) => d >= "2000-01-01", "La fecha es demasiado antigua."),
  // Opcional: si viene vacío, el precio se busca por la fecha de la compra.
  buy_price: z
    .string()
    .transform((v) => (v.trim() === "" ? undefined : parseAmount(v)))
    .pipe(
      z
        .number({ message: "Ingresá un precio válido." })
        .positive("El precio debe ser mayor a 0.")
        .max(1_000_000_000_000, "El precio es demasiado grande.")
        .optional(),
    ),
});

// La compra se carga o por monto invertido ("1000 dólares") o por cantidad
// del activo ("0,06 BTC"); lo que falte se calcula con el precio.
const byAmount = common.extend({
  mode: z.literal("amount"),
  invested: z
    .string()
    .transform(parseAmount)
    .pipe(
      z
        .number({ message: "Ingresá un monto válido." })
        .positive("El monto debe ser mayor a 0.")
        .max(1_000_000_000_000, "El monto es demasiado grande."),
    ),
});

const byQuantity = common.extend({
  mode: z.literal("quantity"),
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

export const purchaseSchema = z.discriminatedUnion("mode", [
  byAmount,
  byQuantity,
]);

export type PurchaseInput = z.infer<typeof purchaseSchema>;
