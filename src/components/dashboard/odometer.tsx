const DIGITS = "0123456789".split("");

/**
 * Número grande con cada cifra en su propia columna 0–9. El valor final está
 * siempre en pantalla; la animación solo hace girar las columnas hasta él.
 * El tamaño de letra se ajusta al ancho del bloque (necesita `.tile-cq`).
 */
export function Odometer({ text }: { text: string }) {
  const chars = [...text];

  return (
    <span
      role="img"
      aria-label={text}
      className="display flex items-start leading-none whitespace-nowrap num"
      style={
        {
          "--n": chars.length,
          fontSize:
            "clamp(2rem, calc(100cqw / (var(--n) * 0.86)), 6.9rem)",
        } as React.CSSProperties
      }
    >
      {chars.map((ch, i) =>
        /\d/.test(ch) ? (
          <span key={i} className="od-slot" aria-hidden="true">
            <span
              className="od-col"
              style={
                {
                  "--d": ch,
                  "--t": `${(0.9 + i * 0.08).toFixed(2)}s`,
                } as React.CSSProperties
              }
            >
              {DIGITS.map((d) => (
                <span key={d}>{d}</span>
              ))}
            </span>
          </span>
        ) : (
          <span key={i} aria-hidden="true">
            {ch === " " ? " " : ch}
          </span>
        ),
      )}
    </span>
  );
}
