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

const arsWholeFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

// Pesos sin centavos, para los números grandes del tablero.
export function formatARSWhole(amount: number): string {
  return arsWholeFormatter.format(Math.round(amount));
}

const compactFormatter = new Intl.NumberFormat("es-AR", {
  maximumFractionDigits: 1,
});

// "2,2 M" o "380 mil": para los ejes de los gráficos.
export function formatCompactARS(amount: number): string {
  const abs = Math.abs(amount);
  if (abs >= 1_000_000) return `${compactFormatter.format(amount / 1_000_000)} M`;
  if (abs >= 1_000) return `${Math.round(amount / 1_000)} mil`;
  return String(Math.round(amount));
}
