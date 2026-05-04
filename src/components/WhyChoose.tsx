import { Zap, Heart, Leaf, Clock } from "lucide-react";

const reasons = [
  { icon: Leaf, title: "100% Ayurvedic", desc: "Made with pure, natural ingredients from ancient Ayurvedic formulas" },
  { icon: Heart, title: "No Side Effects", desc: "Safe for daily use with zero harmful chemicals or artificial additives" },
  { icon: Zap, title: "Fast Relief", desc: "Experience noticeable pain relief within minutes of application" },
  { icon: Clock, title: "Long-Lasting", desc: "Provides sustained relief that lasts throughout the day" },
];

export function WhyChoose() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold font-[var(--font-display)] text-foreground mb-4">
            Why Choose <span className="text-primary">DARDGO?</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Trusted by thousands for natural, effective pain relief
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((r) => (
            <div key={r.title} className="bg-card rounded-2xl p-6 border border-border/50 text-center hover:shadow-brand transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 rounded-xl bg-gradient-gold mx-auto mb-4 flex items-center justify-center">
                <r.icon className="w-6 h-6" style={{ color: '#1a1a1a' }} />
              </div>
              <h3 className="font-semibold text-foreground mb-2 font-[var(--font-display)]">{r.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
