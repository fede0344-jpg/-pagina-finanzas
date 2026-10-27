import { smoothPath, type Point } from "@/lib/utils/smooth-path";

const W = 420;
const H = 210;
const X0 = 8;
const X1 = 400;
const Y_BOTTOM = 200;
const Y_TOP = 34;

/** Curva decorativa del balance acumulado: sube, baja o queda plana según tus datos. */
export function TrendCurve({ values }: { values: number[] }) {
  // Con menos de dos puntos no hay curva real: una subida suave de relleno.
  const series =
    values.length >= 2 ? values : [0.1, 0.16, 0.13, 0.24, 0.3, 0.42, 0.55, 0.7, 1];
  const min = Math.min(...series);
  const max = Math.max(...series);
  const span = max - min || 1;

  const pts: Point[] = series.map((v, i) => [
    X0 + (i * (X1 - X0)) / (series.length - 1),
    max === min
      ? (Y_BOTTOM + Y_TOP) / 2
      : Y_BOTTOM - ((v - min) / span) * (Y_BOTTOM - Y_TOP),
  ]);
  const d = smoothPath(pts);
  const last = pts[pts.length - 1];

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      aria-hidden="true"
      className="parallax pointer-events-none absolute top-16 right-5 h-auto w-[min(58%,390px)] overflow-visible text-on-cel max-sm:top-14 max-sm:w-[62%]"
      style={{ "--pxk": "-16px", "--pyk": "-12px" } as React.CSSProperties}
    >
      <defs>
        <linearGradient id="trend-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="currentColor" stopOpacity="0.32" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 1, 2, 3].map((k) => (
        <line
          key={k}
          x1={X0}
          x2={X1 + 8}
          y1={Y_BOTTOM - k * 56}
          y2={Y_BOTTOM - k * 56}
          stroke="currentColor"
          strokeOpacity="0.16"
        />
      ))}
      <path
        className="trend-area"
        d={`${d}L${last[0]},${Y_BOTTOM}L${X0},${Y_BOTTOM}Z`}
        fill="url(#trend-fill)"
      />
      <path className="trend-line" pathLength={1} d={d} />
      <circle className="trend-ping" cx={last[0]} cy={last[1]} r="6" />
      <circle cx={last[0]} cy={last[1]} r="6" fill="currentColor" />
    </svg>
  );
}
