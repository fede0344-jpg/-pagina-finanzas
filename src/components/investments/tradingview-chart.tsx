"use client";

import { useTheme } from "next-themes";

export function TradingViewChart({ symbol }: { symbol: string }) {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === "light" ? "light" : "dark";

  const config = {
    symbol,
    interval: "D",
    timezone: "America/Argentina/Buenos_Aires",
    theme,
    style: "1",
    locale: "es",
    withdateranges: true,
    allow_symbol_change: true,
    hide_side_toolbar: false,
    save_image: false,
    calendar: false,
    support_host: "https://www.tradingview.com",
  };

  const src = `https://s.tradingview.com/embed-widget/advanced-chart/?locale=es#${encodeURIComponent(
    JSON.stringify(config),
  )}`;

  return (
    <iframe
      key={theme}
      src={src}
      title={`Gráfico de ${symbol}`}
      className="h-full w-full rounded-lg"
      style={{ border: "none" }}
    />
  );
}
