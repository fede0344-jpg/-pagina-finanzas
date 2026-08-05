export function monthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function lastNMonthKeys(n: number, from = new Date()): string[] {
  const keys: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(from.getFullYear(), from.getMonth() - i, 1);
    keys.push(monthKey(d));
  }
  return keys;
}

const monthLabelFormatter = new Intl.DateTimeFormat("es-AR", {
  month: "short",
  year: "2-digit",
});

export function formatMonthLabel(key: string): string {
  const [year, month] = key.split("-").map(Number);
  return monthLabelFormatter.format(new Date(year, month - 1, 1));
}
