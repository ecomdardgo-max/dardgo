import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Leaf, Heart, Target, Shield, Award, Users } from "lucide-react";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About DARDGO — Our Ayurvedic Heritage" },
      { name: "description", content: "Learn about DARDGO's mission to provide natural, Ayurvedic pain relief solutions. Rooted in ancient wisdom, crafted for modern life." },
    ],
  }),
});

function AboutPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="py-8 sm:py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-14">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3">Our Story</span>
              <h1 className="text-3xl sm:text-5xl font-bold text-foreground mb-4">
                About <span className="text-gradient-green">DARDGO</span>
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Born from the ancient wisdom of Ayurveda, DARDGO is on a mission to provide natural, chemical-free pain relief to every Indian household.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="bg-gradient-cream rounded-3xl p-8 sm:p-12 mb-12 border border-border/30">
              <h2 className="text-2xl font-bold text-foreground mb-4">Our Heritage</h2>
              <p className="text-muted-foreground leading-relaxed">
                DARDGO draws from centuries of Ayurvedic knowledge, combining time-tested herbal remedies with modern formulation techniques. Every product is crafted with carefully selected natural ingredients that work in harmony with your body.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid sm:grid-cols-3 gap-5 mb-14">
            {[
              { icon: Leaf, title: "Mission", desc: "To make natural pain relief accessible to every Indian, replacing harmful chemical painkillers with pure Ayurvedic solutions." },
              { icon: Heart, title: "Vision", desc: "A world where people trust nature's healing power over synthetic drugs, living healthier and pain-free lives." },
              { icon: Target, title: "Values", desc: "Authenticity, purity, and transparency in every product. We never compromise on quality or ingredient integrity." },
            ].map((item, i) => (
              <ScrollReveal key={item.title} delay={i * 0.1}>
                <div className="bg-card rounded-3xl p-6 border border-border/30 shadow-card text-center h-full">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 mx-auto mb-4 flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-14">
              {[
                { icon: Shield, label: "AYUSH Certified" },
                { icon: Award, label: "GMP Approved" },
                { icon: Users, label: "10L+ Customers" },
                { icon: Leaf, label: "100% Natural" },
              ].map((b) => (
                <div key={b.label} className="bg-card rounded-2xl p-5 text-center border border-border/30 shadow-card">
                  <b.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="text-sm font-semibold text-foreground">{b.label}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>
      <Footer />
      <WhatsAppFloat />
      <MobileBottomNav />
    </div>
  );
}
