import { ScrollReveal } from "@/components/ScrollReveal";
import { Leaf, FlaskConical, HeartPulse, BadgeCheck } from "lucide-react";

const benefits = [
  {
    icon: Leaf,
    title: "Botanical-first formulas",
    desc: "Herbal actives chosen for traditional relevance and modern quality checks — always read your pack.",
  },
  {
    icon: FlaskConical,
    title: "Mindful excipients",
    desc: "We prioritise clean labels and avoid unnecessary fillers where the product format allows.",
  },
  {
    icon: BadgeCheck,
    title: "Tested batches",
    desc: "AYUSH-oriented documentation and laboratory checks help us keep specifications consistent.",
  },
  {
    icon: HeartPulse,
    title: "Professional guidance",
    desc: "We encourage pairing supplements and topicals with sleep, movement, and advice from your clinician.",
  },
];

export function AyurvedicBenefits() {
  return (
    <section className="py-16 sm:py-24 lg:py-28 bg-gradient-cream">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-10 sm:mb-14 max-w-2xl mx-auto">
            <span className="text-eyebrow text-primary mb-4 block">— Why Ayurveda</span>
            <h2 className="text-display-2 text-foreground mb-4">
              The Ayurvedic <span className="text-gradient-green">advantage</span>
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              Ancient wisdom meets modern science — for your everyday wellbeing.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {benefits.map((b, i) => (
            <ScrollReveal key={b.title} delay={i * 0.1}>
              <div className="group bg-card rounded-3xl p-6 sm:p-7 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 border border-border/30 h-full">
                <div className="w-12 h-12 rounded-2xl bg-primary/8 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                  <b.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground text-base mb-2">{b.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
