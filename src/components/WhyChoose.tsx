import { ScrollReveal } from "@/components/ScrollReveal";
import { Truck, Shield, IndianRupee, Leaf, Award, Headphones } from "lucide-react";

const reasons = [
  {
    icon: Leaf,
    title: "Ayurvedic-inspired",
    desc: "Classical herbs and transparent sourcing where the format allows",
  },
  {
    icon: Shield,
    title: "Label-first safety",
    desc: "Clear directions; consult your clinician if you take medications",
  },
  {
    icon: Award,
    title: "Quality systems",
    desc: "AYUSH-oriented range with GMP-focused manufacturing partners",
  },
  { icon: Truck, title: "Free shipping", desc: "Prepaid orders above ₹249 across most of India" },
  { icon: IndianRupee, title: "COD available", desc: "Cash on delivery in eligible pincodes" },
  { icon: Headphones, title: "Care team", desc: "Phone & WhatsApp support during staffed hours" },
];

export function WhyChoose() {
  return (
    <section className="py-16 sm:py-24 lg:py-28 bg-gradient-cream">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-10 sm:mb-14 max-w-2xl mx-auto">
            <span className="text-eyebrow text-primary mb-4 block">— Why us</span>
            <h2 className="text-display-2 text-foreground mb-4">
              Why choose <span className="text-gradient-green">DARDGO</span>
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              Honest herbal wellness with premium packaging and responsive service.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5">
          {reasons.map((r, i) => (
            <ScrollReveal key={r.title} delay={i * 0.08}>
              <div className="group bg-card rounded-3xl p-5 sm:p-6 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 border border-border/30 text-center h-full">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-primary/8 mx-auto mb-3 flex items-center justify-center group-hover:bg-primary/15 group-hover:scale-110 transition-all">
                  <r.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-sm sm:text-base text-foreground mb-1">
                  {r.title}
                </h3>
                <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed">
                  {r.desc}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
