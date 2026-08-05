import { z } from "zod";

export const CATEGORY_COLORS = [
  "#16a34a",
  "#22c55e",
  "#4ade80",
  "#06b6d4",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#ef4444",
  "#f97316",
  "#eab308",
  "#64748b",
] as const;

export const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "El nombre es obligatorio.")
    .max(40, "Máximo 40 caracteres."),
  kind: z.enum(["income", "expense"], {
    message: "Elegí ingreso o gasto.",
  }),
  color: z.enum(CATEGORY_COLORS).default(CATEGORY_COLORS[10]),
});

export type CategoryInput = z.infer<typeof categorySchema>;
