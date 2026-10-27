"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { PRIVACY_COOKIE } from "@/lib/privacy";


interface PrivacyState {
  hidden: boolean;
  toggle: () => void;
}

// Sin proveedor (landing, pantallas públicas) los montos se ven siempre.
const PrivacyContext = createContext<PrivacyState>({
  hidden: false,
  toggle: () => {},
});

/**
 * Modo privado: oculta los montos de plata. La elección se guarda en una
 * cookie para que el servidor ya renderice oculto (sin "parpadeo" de números
 * al cargar) y se recuerde entre visitas.
 */
export function PrivacyProvider({
  initialHidden,
  children,
}: {
  initialHidden: boolean;
  children: React.ReactNode;
}) {
  const [hidden, setHidden] = useState(initialHidden);

  const toggle = useCallback(() => {
    const next = !hidden;
    setHidden(next);
    document.cookie = `${PRIVACY_COOKIE}=${next ? "1" : "0"}; path=/; max-age=31536000; samesite=lax`;
  }, [hidden]);

  return (
    <PrivacyContext.Provider value={{ hidden, toggle }}>
      {children}
    </PrivacyContext.Provider>
  );
}

export function usePrivacy() {
  return useContext(PrivacyContext);
}
