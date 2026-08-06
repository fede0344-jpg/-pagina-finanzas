import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: "variable",
  style: ["normal", "italic"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const title = "Financitas — Ingresos, gastos e inversiones en un solo lugar";
const description =
  "Organizá tus ingresos y gastos, y seguí cripto, CEDEARs, acciones y bonos por nivel de riesgo con precios que se actualizan solos.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s — Financitas",
  },
  description,
  openGraph: {
    title,
    description,
    siteName: "Financitas",
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
