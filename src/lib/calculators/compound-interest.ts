export interface CompoundInterestInput {
  initial: number;
  monthlyContribution: number;
  years: number;
  annualRatePercent: number;
  compoundsPerYear: number;
}

export interface CompoundInterestYearPoint {
  year: number;
  balance: number;
  totalContributions: number;
  totalInterest: number;
}

export interface CompoundInterestResult {
  yearly: CompoundInterestYearPoint[];
  endBalance: number;
  totalContributions: number;
  totalInterest: number;
}

export const COMPOUND_FREQUENCIES: { value: number; label: string }[] = [
  { value: 1, label: "Anual" },
  { value: 2, label: "Semestral" },
  { value: 4, label: "Trimestral" },
  { value: 12, label: "Mensual" },
  { value: 365, label: "Diaria" },
];

export function calculateCompoundInterest({
  initial,
  monthlyContribution,
  years,
  annualRatePercent,
  compoundsPerYear,
}: CompoundInterestInput): CompoundInterestResult {
  const annualRate = annualRatePercent / 100;
  // Convertimos la tasa anual (según la frecuencia de capitalización elegida)
  // a una tasa mensual equivalente, así los aportes mensuales encajan bien
  // sin importar si la capitalización es diaria, mensual o anual.
  const monthlyRate =
    annualRate === 0
      ? 0
      : Math.pow(1 + annualRate / compoundsPerYear, compoundsPerYear / 12) - 1;

  let balance = initial;
  let contributed = initial;
  const yearly: CompoundInterestYearPoint[] = [];
  const totalMonths = Math.max(Math.round(years * 12), 1);

  for (let month = 1; month <= totalMonths; month++) {
    balance = balance * (1 + monthlyRate) + monthlyContribution;
    contributed += monthlyContribution;

    if (month % 12 === 0) {
      yearly.push({
        year: month / 12,
        balance,
        totalContributions: contributed,
        totalInterest: balance - contributed,
      });
    }
  }

  if (totalMonths % 12 !== 0) {
    yearly.push({
      year: Math.round((totalMonths / 12) * 10) / 10,
      balance,
      totalContributions: contributed,
      totalInterest: balance - contributed,
    });
  }

  return {
    yearly,
    endBalance: balance,
    totalContributions: contributed,
    totalInterest: balance - contributed,
  };
}
