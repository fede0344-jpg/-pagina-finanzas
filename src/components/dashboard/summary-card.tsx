import { Card, CardContent } from "@/components/ui/card";
import { AnimatedAmount } from "./animated-amount";
import { cn } from "@/lib/utils";

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
    <Card>
      <CardContent className="flex flex-col gap-1">
        <span className="text-sm text-muted-foreground">{label}</span>
        <div className="flex items-baseline gap-2">
          <span
            className={cn(
              "text-2xl font-semibold",
              tone === "positive" && "text-positive",
              tone === "negative" && "text-negative",
            )}
          >
            <AnimatedAmount amount={amount} />
          </span>
          {hint ? (
            <span
              className={cn(
                "text-sm font-medium",
                tone === "positive" && "text-positive",
                tone === "negative" && "text-negative",
                tone === "neutral" && "text-muted-foreground",
              )}
            >
              {hint}
            </span>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
