import { ImageResponse } from "next/og";

export const alt = "Financitas — Organizá tus ingresos, gastos e inversiones";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 28,
          background:
            "linear-gradient(135deg, #0b1220 0%, #101a30 55%, #0e1a15 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 88,
              height: 88,
              borderRadius: 22,
              background: "#3357b0",
              display: "flex",
            }}
          />
          <div style={{ display: "flex", fontSize: 84, fontWeight: 700, color: "white" }}>
            Financitas
          </div>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 34,
            color: "#a8b3c7",
            textAlign: "center",
            maxWidth: 860,
          }}
        >
          Ingresos, gastos e inversiones en un solo lugar
        </div>
      </div>
    ),
    { ...size },
  );
}
