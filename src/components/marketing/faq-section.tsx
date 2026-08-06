import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    question: "¿Es gratis de verdad?",
    answer: "Sí. Crear una cuenta y usar Financitas no tiene costo.",
  },
  {
    question: "¿Necesito vincular mi cuenta bancaria?",
    answer:
      "No. Vos cargás tus ingresos y gastos manualmente, en segundos. Nunca te pedimos acceso a tu banco ni a tus tarjetas.",
  },
  {
    question: "¿De dónde salen los precios de las inversiones?",
    answer:
      "De fuentes públicas como CoinGecko, data912.com y dolarapi.com. Vos elegís qué activos seguir y nosotros traemos el precio y el gráfico automáticamente, sin que cargues nada a mano.",
  },
  {
    question: "¿Esto es asesoramiento financiero?",
    answer:
      "No. La información de inversiones es solo para que hagas seguimiento de lo que te interesa — no es una recomendación ni un consejo de inversión.",
  },
  {
    question: "Si dejo de usarla, ¿qué pasa con mis datos?",
    answer:
      "Podés pedirnos que eliminemos tu cuenta y todos tus datos cuando quieras, escribiendo a fede0344@gmail.com.",
  },
];

export function FaqSection() {
  return (
    <section className="mx-auto max-w-2xl px-4 py-16">
      <h2 className="font-display text-center text-2xl font-semibold tracking-tight">
        Preguntas frecuentes
      </h2>
      <div className="mt-8 flex flex-col divide-y divide-border rounded-xl border bg-card">
        {FAQS.map((faq) => (
          <details key={faq.question} className="group p-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium [&::-webkit-details-marker]:hidden">
              {faq.question}
              <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
            </summary>
            <p className="mt-2 text-sm text-muted-foreground">
              {faq.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
