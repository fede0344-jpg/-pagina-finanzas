import { z } from "zod";

export const assetSchema = z.object({
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
  risk_level: z.enum(["bajo", "medio", "alto"], {
    message: "Elegí un nivel de riesgo.",
  }),
});

export type AssetInput = z.infer<typeof assetSchema>;
