import { z } from "zod";
import { parseAmount } from "./portfolio-schema";

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export const purchaseSchema = z.object({
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
  invested: z
    .string()
    .transform(parseAmount)
    .pipe(
      z
        .number({ message: "Ingresá un monto válido." })
        .positive("El monto debe ser mayor a 0.")
        .max(1_000_000_000_000, "El monto es demasiado grande."),
    ),
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

export type PurchaseInput = z.infer<typeof purchaseSchema>;
