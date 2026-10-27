import { formatARSWhole } from "@/lib/utils/format";
import { Money } from "@/components/privacy/money";
import { Odometer } from "./odometer";
import { TrendCurve } from "./trend-curve";

export function BalanceTile({
  balance,
  curve,
  savingsRate,
}: {
  balance: number;
  curve: number[];
  savingsRate: number | null;
}) {
  return (
    <section
      className="tile tile-cel tile-cq tilt flex min-h-[392px] flex-col justify-between max-sm:min-h-[340px] lg:col-span-7"
      style={{ "--i": 0 } as React.CSSProperties}
    >
      <TrendCurve values={curve} />

      <div className="relative z-[2] flex items-center gap-2">
        <span className="eyebrow">Balance total</span>
        {savingsRate !== null ? (
          <span className="rounded-full bg-white/18 px-2.5 py-1 text-xs font-bold">
            {savingsRate >= 0 ? "+" : ""}
            {savingsRate.toFixed(0)}% ahorro del mes
          </span>
        ) : null}
      </div>

      <div className="parallax relative z-[2]">
        <Money mask={<Odometer text="$ ••••••" />}>
          <Odometer text={formatARSWhole(balance)} />
        </Money>
        <p className="mt-3 max-w-sm text-sm text-muted-foreground">
          Todo lo que ingresó menos todo lo que gastaste, desde que empezaste a
          cargar movimientos.
        </p>
      </div>
    </section>
  );
}
