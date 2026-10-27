import { Plus } from "lucide-react";

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
    <section
      id="preguntas"
      className="mx-auto grid w-full max-w-[1320px] scroll-mt-20 gap-8 px-4 py-16 md:px-8 lg:grid-cols-12"
    >
      <h2 className="display text-4xl leading-[1] text-balance sm:text-5xl lg:col-span-5">
        Preguntas frecuentes
      </h2>
      <div className="flex flex-col gap-3 lg:col-span-7">
        {FAQS.map((faq) => (
          <details
            key={faq.question}
            className="tile group p-0 [&_summary::-webkit-details-marker]:hidden"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 font-bold">
              {faq.question}
              <Plus className="size-5 shrink-0 text-primary transition-transform group-open:rotate-45" />
            </summary>
            <p className="px-6 pb-5 text-sm text-muted-foreground">
              {faq.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
