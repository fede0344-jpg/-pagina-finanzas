"use client";

import { useEffect, useRef, useState } from "react";
import { formatARSWhole, formatCurrency } from "@/lib/utils/format";

const DURATION_MS = 700;

// Cuenta desde 0 hasta el valor real al cargar. Si el sistema pide menos
// movimiento, muestra el número final directamente.
export function AnimatedAmount({
  amount,
  currency = "usd",
}: {
  amount: number;
  currency?: "usd" | "ars";
}) {
  const [display, setDisplay] = useState(amount);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // El estado ya arranca en el valor final, así que sin movimiento no
    // hace falta tocar nada.
    if (prefersReduced || amount === 0) return;

    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / DURATION_MS, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(amount * eased);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      }
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [amount]);

  return <>{currency === "ars" ? formatARSWhole(display) : formatCurrency(display)}</>;
}
