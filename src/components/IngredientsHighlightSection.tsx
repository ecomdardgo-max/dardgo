import { ScrollReveal } from "@/components/ScrollReveal";
import { Leaf, Droplets, Sparkles } from "lucide-react";

const highlights = [
  {
    icon: Leaf,
    title: "Herbal actives",
    body: "Formulations draw on classical Ayurvedic ingredients selected for quality and consistency — not hype.",
  },
  {
    icon: Droplets,
    title: "Oils & topicals",
    body: "Massage oils and roll-ons designed for everyday comfort, warm-up routines, and post-activity wind-down.",
  },
  {
    icon: Sparkles,
    title: "Transparent labels",
    body: "We encourage you to read directions, batch details, and storage notes on every pack before use.",
  },
];

export function IngredientsHighlightSection() {
  return (
    <section className="py-14 sm:py-20 bg-background border-y border-border/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
            <span className="text-eyebrow text-primary mb-3 block">— Formulation philosophy</span>
            <h2 className="text-display-2 text-foreground mb-3">
              Ingredients with <span className="text-gradient-green">intention</span>
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Traditional herbal support for people who value clear labeling, steady routines, and
              honest wellness storytelling — without disease claims.
            </p>
          </div>
        </ScrollReveal>
        <div className="grid md:grid-cols-3 gap-4 sm:gap-6">
          {highlights.map((h, i) => (
            <ScrollReveal key={h.title} delay={i * 0.08}>
              <div className="h-full rounded-3xl border border-border/50 bg-card/80 p-6 shadow-card hover:shadow-card-hover transition-shadow">
                <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <h.icon className="w-5 h-5 text-primary" strokeWidth={2.2} />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{h.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{h.body}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
