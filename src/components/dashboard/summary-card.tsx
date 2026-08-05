import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils/format";
import { cn } from "@/lib/utils";

export function SummaryCard({
  label,
  amount,
  tone = "neutral",
}: {
  label: string;
  amount: number;
  tone?: "neutral" | "positive" | "negative";
}) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-1">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span
          className={cn(
            "text-2xl font-semibold",
            tone === "positive" && "text-positive",
            tone === "negative" && "text-negative",
          )}
        >
          {formatCurrency(amount)}
        </span>
      </CardContent>
    </Card>
  );
}
