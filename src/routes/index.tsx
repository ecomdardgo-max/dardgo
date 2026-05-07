import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { CategoryIcons } from "@/components/CategoryIcons";
import { HeroSection } from "@/components/HeroSection";
import { TrustStrip } from "@/components/TrustStrip";
import { ProductShowcase } from "@/components/ProductShowcase";
import { WhyChoose } from "@/components/WhyChoose";
import { ProblemSolution } from "@/components/ProblemSolution";
import { HowItWorks } from "@/components/HowItWorks";
import { Testimonials } from "@/components/Testimonials";
import { ShippingBar } from "@/components/ShippingBar";
import { WhatsAppCTA } from "@/components/WhatsAppCTA";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "DARDGO — Ayurvedic Pain Relief | Dard se Azaadi, Naturally" },
      { name: "description", content: "DARDGO offers 100% Ayurvedic pain relief products. Natural, safe, and effective solutions for joint pain, back pain, and muscle soreness. AYUSH Certified, GMP & FDA Approved. Made in India." },
      { property: "og:title", content: "DARDGO — Best Ayurvedic Medicine Manufacturer" },
      { property: "og:description", content: "100% Ayurvedic pain relief & wellness. No chemicals, no side effects — just nature's best." },
    ],
  }),
});

function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <CategoryIcons />
      <HeroSection />
      <TrustStrip />
      <ProductShowcase />
      <WhyChoose />
      <ProblemSolution />
      <HowItWorks />
      <ShippingBar />
      <Testimonials />
      <WhatsAppCTA />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
