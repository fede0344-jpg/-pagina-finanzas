import { ArrowDownLeft, ArrowUpRight, PiggyBank } from "lucide-react";
import { AnimatedAmount } from "./animated-amount";
import { cn } from "@/lib/utils";

const KINDS = {
  ing: { icon: ArrowDownLeft, tile: "", chip: "bg-green/15 text-green" },
  gas: { icon: ArrowUpRight, tile: "tile-ink", chip: "bg-red/20 text-red" },
  aho: { icon: PiggyBank, tile: "tile-sol", chip: "bg-white/45 text-on-sol" },
} as const;

export function StatTile({
  kind,
  label,
  amount,
  hint,
  index,
  className,
}: {
  kind: keyof typeof KINDS;
  label: string;
  amount: number;
  hint?: string;
  index: number;
  className?: string;
}) {
  const { icon: Icon, tile, chip } = KINDS[kind];

  return (
    <section
      className={cn(
        "tile tile-cq tilt flex min-h-44 flex-col justify-between gap-6",
        tile,
        className,
      )}
      style={{ "--i": index } as React.CSSProperties}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="eyebrow">{label}</span>
        <span
          className={cn(
            "flex size-8 items-center justify-center rounded-full",
            chip,
          )}
        >
          <Icon className="size-4" />
        </span>
      </div>
      <div>
        <p className="display num text-[clamp(1.5rem,9cqw,2.4rem)] leading-none">
          <AnimatedAmount amount={amount} currency="ars" />
        </p>
        {hint ? (
          <p className="mt-2 text-sm font-semibold opacity-70">{hint}</p>
        ) : null}
      </div>
    </section>
  );
}
