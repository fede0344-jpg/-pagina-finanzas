"use client";

import { useEffect } from "react";

/**
 * Luz que sigue al mouse, inclinación y paralaje de los bloques `.tile`.
 * Un solo oyente delegado en el documento: no importa cuántos bloques haya.
 * Solo corre con mouse (no touch) y si la persona no pidió menos movimiento.
 */
export function TileEffects() {
  useEffect(() => {
    const ok = matchMedia(
      "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    if (!ok.matches) return;

    let current: HTMLElement | null = null;
    let raf = 0;

    const reset = (el: HTMLElement | null) => {
      if (!el) return;
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
      el.style.setProperty("--px", "0");
      el.style.setProperty("--py", "0");
    };

    const onMove = (e: PointerEvent) => {
      const tile = (e.target as Element | null)?.closest<HTMLElement>(".tile, [data-slot=card]");
      if (tile !== current) {
        reset(current);
        current = tile ?? null;
      }
      if (!tile) return;
      cancelAnimationFrame(raf);
      const { clientX, clientY } = e;
      raf = requestAnimationFrame(() => {
        const r = tile.getBoundingClientRect();
        const x = clientX - r.left;
        const y = clientY - r.top;
        const nx = x / r.width - 0.5;
        const ny = y / r.height - 0.5;
        tile.style.setProperty("--mx", `${x}px`);
        tile.style.setProperty("--my", `${y}px`);
        tile.style.setProperty("--rx", `${(-ny * 7).toFixed(2)}deg`);
        tile.style.setProperty("--ry", `${(nx * 9).toFixed(2)}deg`);
        tile.style.setProperty("--px", nx.toFixed(3));
        tile.style.setProperty("--py", ny.toFixed(3));
      });
    };

    const onLeave = () => {
      cancelAnimationFrame(raf);
      reset(current);
      current = null;
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return null;
}
