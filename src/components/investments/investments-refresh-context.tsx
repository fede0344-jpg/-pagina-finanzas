"use client";

import { createContext, useContext } from "react";

export const InvestmentsRefreshContext = createContext<() => void>(() => {});

export function useInvestmentsRefresh() {
  return useContext(InvestmentsRefreshContext);
}
