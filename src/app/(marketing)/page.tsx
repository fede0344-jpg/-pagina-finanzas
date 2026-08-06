import { Hero } from "@/components/marketing/hero";
import { DashboardPreview } from "@/components/marketing/dashboard-preview";
import { FeaturesSection } from "@/components/marketing/features-section";
import { FaqSection } from "@/components/marketing/faq-section";
import { CtaSection } from "@/components/marketing/cta-section";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <div className="px-4 pb-16">
        <DashboardPreview />
      </div>
      <FeaturesSection />
      <FaqSection />
      <CtaSection />
    </>
  );
}
