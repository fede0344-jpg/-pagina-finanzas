export interface PriceTargetInput {
  investedAmount: number;
  currentPrice: number;
  targetPrice: number;
  years: number;
}

export interface PriceTargetYearPoint {
  year: number;
  value: number;
}

export interface PriceTargetResult {
  quantity: number;
  projectedValue: number;
  gain: number;
  totalReturnPercent: number;
  annualizedReturnPercent: number | null;
  yearly: PriceTargetYearPoint[];
}

export function calculatePriceTargetReturn({
  investedAmount,
  currentPrice,
  targetPrice,
  years,
}: PriceTargetInput): PriceTargetResult {
  const quantity = currentPrice > 0 ? investedAmount / currentPrice : 0;
  const projectedValue = quantity * targetPrice;
  const gain = projectedValue - investedAmount;
  const totalReturnPercent =
    currentPrice > 0 ? (targetPrice / currentPrice - 1) * 100 : 0;

  const annualizedReturnPercent =
    years > 0 && currentPrice > 0 && targetPrice > 0
      ? (Math.pow(targetPrice / currentPrice, 1 / years) - 1) * 100
      : null;

  // Curva ilustrativa: interpola el crecimiento año a año asumiendo una
  // tasa constante (la anualizada), forzando el último punto al valor
  // proyectado exacto para que no haya desvíos por redondeo.
  const wholeYears = Math.max(Math.round(years), 1);
  const growthPerYear =
    annualizedReturnPercent !== null ? annualizedReturnPercent / 100 : 0;

  const yearly: PriceTargetYearPoint[] = [];
  for (let y = 0; y <= wholeYears; y++) {
    const value =
      y === wholeYears
        ? projectedValue
        : investedAmount * Math.pow(1 + growthPerYear, y);
    yearly.push({ year: y, value });
  }

  return {
    quantity,
    projectedValue,
    gain,
    totalReturnPercent,
    annualizedReturnPercent,
    yearly,
  };
}
