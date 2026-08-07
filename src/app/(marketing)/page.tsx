import { Hero } from "@/components/marketing/hero";
import { FeaturesSection } from "@/components/marketing/features-section";
import { FaqSection } from "@/components/marketing/faq-section";
import { CtaSection } from "@/components/marketing/cta-section";

// Las cotizaciones del ticker se refrescan cada minuto sin volver a
// renderizar toda la página para cada visita.
export const revalidate = 60;

export default function LandingPage() {
  return (
    <>
      <Hero />
      <div className="reveal">
        <FeaturesSection />
      </div>
      <div className="reveal">
        <FaqSection />
      </div>
      <div className="reveal">
        <CtaSection />
      </div>
    </>
  );
}
