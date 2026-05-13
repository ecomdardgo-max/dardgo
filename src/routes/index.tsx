import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { TrustStrip } from "@/components/TrustStrip";
import { TrustedBySection } from "@/components/TrustedBySection";
import { ProblemSolution } from "@/components/ProblemSolution";
import { ProductShowcase } from "@/components/ProductShowcase";
import { CollectionShowcases } from "@/components/CollectionShowcases";
import { AyurvedicBenefits } from "@/components/AyurvedicBenefits";
import { WhyChoose } from "@/components/WhyChoose";
import { HowItWorks } from "@/components/HowItWorks";
import { Testimonials } from "@/components/Testimonials";
import { NewsletterSection } from "@/components/NewsletterSection";
import { IngredientsHighlightSection } from "@/components/IngredientsHighlightSection";
import { CustomerCareSection } from "@/components/CustomerCareSection";
import { HomepageFaqSection } from "@/components/HomepageFaqSection";
import { HomepageSecureCheckoutBand } from "@/components/HomepageSecureCheckoutBand";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      {
        title: "DARDGO — Ayurvedic herbal wellness & comfort care | traditional oils & supplements",
      },
      {
        name: "description",
        content:
          "Shop DARDGO for Ayurvedic-inspired herbal wellness: massage oils, roll-ons, and daily comfort products made in India. AYUSH-oriented quality, transparent labels, secure checkout.",
      },
      {
        property: "og:title",
        content: "DARDGO — Premium Ayurvedic-inspired wellness for everyday comfort",
      },
      {
        property: "og:description",
        content:
          "Herbal wellness support rooted in tradition — designed for active lifestyles and honest self-care. Ab Raho Har Pal Khush.",
      },
    ],
  }),
});

function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <TrustStrip />
      <TrustedBySection />
      <ProductShowcase />
      <ProblemSolution />
      <CollectionShowcases />
      <AyurvedicBenefits />
      <WhyChoose />
      <HowItWorks />
      <IngredientsHighlightSection />
      <Testimonials />
      <CustomerCareSection />
      <HomepageFaqSection />
      <section className="border-y border-border/40 bg-muted/15 py-10 sm:py-12 lg:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6 lg:items-stretch">
            <HomepageSecureCheckoutBand layout="split" />
            <NewsletterSection layout="split" />
          </div>
        </div>
      </section>
      <Footer />
      <WhatsAppFloat />
      <MobileBottomNav />
    </div>
  );
}
