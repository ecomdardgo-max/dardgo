import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { TrustStrip } from "@/components/TrustStrip";
import { TrustedBySection } from "@/components/TrustedBySection";
import { ProductShowcase } from "@/components/ProductShowcase";
import { CollectionShowcases } from "@/components/CollectionShowcases";
import { AyurvedicBenefits } from "@/components/AyurvedicBenefits";
import { WhyChoose } from "@/components/WhyChoose";
import { HowItWorks } from "@/components/HowItWorks";
import { Testimonials } from "@/components/Testimonials";
import { BlogPreview } from "@/components/BlogPreview";
import { NewsletterSection } from "@/components/NewsletterSection";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "DARDGO — India's Best Ayurvedic Pain Relief | 100% Natural" },
      { name: "description", content: "DARDGO offers premium 100% Ayurvedic pain relief products. Natural, safe, and effective solutions for joint pain, back pain, and muscle soreness. AYUSH Certified, GMP & FDA Approved." },
      { property: "og:title", content: "DARDGO — India's Most Trusted Ayurvedic Pain Relief" },
      { property: "og:description", content: "Ab Raho Har Pal Khush! Premium Ayurvedic wellness products — no chemicals, no side effects." },
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
      <CollectionShowcases />
      <AyurvedicBenefits />
      <WhyChoose />
      <HowItWorks />
      <Testimonials />
      <BlogPreview />
      <NewsletterSection />
      <Footer />
      <WhatsAppFloat />
      <MobileBottomNav />
    </div>
  );
}
