import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { Leaf, Heart, Target } from "lucide-react";

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
      <div className="pt-24 pb-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">Our Story</span>
            <h1 className="text-4xl sm:text-5xl font-bold font-[var(--font-display)] text-foreground mb-6">
              About <span className="text-primary">DARDGO</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Born from the ancient wisdom of Ayurveda, DARDGO is on a mission to provide natural, chemical-free pain relief to every Indian household.
            </p>
          </div>

          <div className="prose prose-lg max-w-none mb-16">
            <div className="bg-brand-cream rounded-2xl p-8 sm:p-10 mb-10">
              <h2 className="text-2xl font-bold font-[var(--font-display)] text-foreground mb-4">Our Heritage</h2>
              <p className="text-muted-foreground leading-relaxed">
                DARDGO draws from centuries of Ayurvedic knowledge, combining time-tested herbal remedies with modern formulation techniques. Every product is crafted with carefully selected natural ingredients that work in harmony with your body to provide effective, lasting relief from pain.
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-8 mb-16">
            {[
              { icon: Leaf, title: "Mission", desc: "To make natural pain relief accessible to every Indian, replacing harmful chemical painkillers with pure Ayurvedic solutions." },
              { icon: Heart, title: "Vision", desc: "A world where people trust nature's healing power over synthetic drugs, living healthier and pain-free lives." },
              { icon: Target, title: "Values", desc: "Authenticity, purity, and transparency in every product. We never compromise on quality or ingredient integrity." },
            ].map((item) => (
              <div key={item.title} className="bg-card rounded-2xl p-6 border border-border/50 text-center">
                <div className="w-12 h-12 rounded-xl bg-primary/10 mx-auto mb-4 flex items-center justify-center">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold font-[var(--font-display)] text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
