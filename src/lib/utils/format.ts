const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function formatCurrency(amount: number): string {
  return currencyFormatter.format(amount);
}

const arsFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
});

export function formatARS(amount: number): string {
  return arsFormatter.format(amount);
}

const dateFormatter = new Intl.DateTimeFormat("es-AR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: "UTC",
});

export function formatDate(isoDate: string): string {
  return dateFormatter.format(new Date(isoDate));
}
