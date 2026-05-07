import { ScrollReveal } from "@/components/ScrollReveal";
import { Leaf, FlaskConical, HeartPulse, BadgeCheck } from "lucide-react";

const benefits = [
  {
    icon: Leaf,
    title: "100% Natural Ingredients",
    desc: "Every product uses pure herbs and botanical extracts sourced from trusted Ayurvedic farms across India.",
  },
  {
    icon: FlaskConical,
    title: "No Chemicals or Side Effects",
    desc: "Free from parabens, sulfates, and synthetic additives. Safe for daily use by all age groups.",
  },
  {
    icon: BadgeCheck,
    title: "Certified & Lab Tested",
    desc: "AYUSH certified, GMP compliant, and FDA approved. Every batch undergoes rigorous quality testing.",
  },
  {
    icon: HeartPulse,
    title: "Doctor Recommended",
    desc: "Formulated with guidance from Ayurvedic physicians with decades of clinical experience.",
  },
];

export function AyurvedicBenefits() {
  return (
    <section className="py-14 sm:py-20 bg-gradient-cream">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-10">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3">
              Why Ayurveda?
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-foreground mb-3">
              The <span className="text-gradient-green">Ayurvedic</span> Advantage
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto">
              Ancient wisdom meets modern science for your wellbeing
            </p>
          </div>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
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
