import { Zap, Heart, Leaf, Clock } from "lucide-react";

const reasons = [
  { icon: Leaf, title: "100% Ayurvedic", desc: "Pure, natural ingredients from ancient Ayurvedic formulas", num: "150+" , numLabel: "Years Heritage" },
  { icon: Heart, title: "No Side Effects", desc: "Safe for daily use with zero harmful chemicals", num: "0%", numLabel: "Chemicals" },
  { icon: Zap, title: "Fast Relief", desc: "Noticeable pain relief within minutes of application", num: "10M+", numLabel: "Happy Customers" },
  { icon: Clock, title: "Long-Lasting", desc: "Sustained relief that lasts throughout the day", num: "100+", numLabel: "Products" },
];

export function WhyChoose() {
  return (
    <section className="py-14 sm:py-20 bg-brand-cream">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-4xl font-bold font-[var(--font-display)] text-foreground mb-3">
            Why Choose <span className="text-primary">DARDGO?</span>
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-lg mx-auto">
            Trusted by thousands for natural, effective pain relief
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {reasons.map((r) => (
            <div key={r.title} className="bg-card rounded-2xl p-5 sm:p-6 border border-border/40 text-center hover:shadow-brand transition-all duration-300 hover:-translate-y-1 group">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-primary/10 mx-auto mb-3 sm:mb-4 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                <r.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              </div>
              <p className="text-xl sm:text-2xl font-bold text-primary mb-0.5">{r.num}</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground mb-2">{r.numLabel}</p>
              <h3 className="font-bold text-sm text-foreground mb-1 font-[var(--font-display)]">{r.title}</h3>
              <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed hidden sm:block">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
