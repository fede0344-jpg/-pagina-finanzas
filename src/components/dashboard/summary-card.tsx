import { AnimatedAmount } from "./animated-amount";
import { cn } from "@/lib/utils";

/** Bloque de un número con etiqueta. Lo usan las calculadoras. */
export function SummaryCard({
  label,
  amount,
  tone = "neutral",
  hint,
}: {
  label: string;
  amount: number;
  tone?: "neutral" | "positive" | "negative";
  hint?: string;
}) {
  return (
    <section className="tile tile-cq tilt flex flex-col gap-3 p-5">
      <span className="eyebrow text-muted-foreground">{label}</span>
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span
          className={cn(
            "display num text-[clamp(1.25rem,8cqw,2rem)] leading-none",
            tone === "positive" && "text-positive",
            tone === "negative" && "text-negative",
          )}
        >
          <AnimatedAmount amount={amount} />
        </span>
        {hint ? (
          <span
            className={cn(
              "text-sm font-semibold",
              tone === "positive" && "text-positive",
              tone === "negative" && "text-negative",
              tone === "neutral" && "text-muted-foreground",
            )}
          >
            {hint}
          </span>
        ) : null}
      </div>
    </section>
  );
}
