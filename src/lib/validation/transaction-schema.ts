import { z } from "zod";

export const transactionSchema = z.object({
  type: z.enum(["income", "expense"], { message: "Elegí ingreso o gasto." }),
  category_id: z
    .string()
    .optional()
    .transform((v) => (v && v.length > 0 ? v : null)),
  amount: z.coerce
    .number({ message: "Ingresá un monto válido." })
    .positive("El monto debe ser mayor a 0."),
  occurred_on: z.string().min(1, "La fecha es obligatoria."),
  description: z
    .string()
    .trim()
    .max(200, "Máximo 200 caracteres.")
    .optional()
    .transform((v) => (v && v.length > 0 ? v : null)),
});

export type TransactionInput = z.infer<typeof transactionSchema>;
