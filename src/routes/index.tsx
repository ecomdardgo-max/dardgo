import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { TrustBadges } from "@/components/TrustBadges";
import { ProblemSolution } from "@/components/ProblemSolution";
import { ProductShowcase } from "@/components/ProductShowcase";
import { WhyChoose } from "@/components/WhyChoose";
import { Testimonials } from "@/components/Testimonials";
import { HowItWorks } from "@/components/HowItWorks";
import { WhatsAppCTA } from "@/components/WhatsAppCTA";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "DARDGO — Ayurvedic Pain Relief | Dard se Azaadi, Naturally" },
      { name: "description", content: "DARDGO offers 100% Ayurvedic pain relief products. Natural, safe, and effective solutions for joint pain, back pain, and muscle soreness. Made in India." },
      { property: "og:title", content: "DARDGO — Ayurvedic Pain Relief" },
      { property: "og:description", content: "100% Ayurvedic pain relief. No chemicals, no side effects — just nature's best." },
    ],
  }),
});

function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <TrustBadges />
      <ProblemSolution />
      <ProductShowcase />
      <WhyChoose />
      <HowItWorks />
      <Testimonials />
      <WhatsAppCTA />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
