import { ScrollReveal } from "@/components/ScrollReveal";
import { Truck, Shield, IndianRupee, Leaf, Award, Headphones } from "lucide-react";

const reasons = [
  { icon: Leaf, title: "100% Ayurvedic", desc: "Pure natural ingredients from ancient formulas" },
  { icon: Shield, title: "No Side Effects", desc: "Safe for daily use, zero harmful chemicals" },
  { icon: Award, title: "Certified Quality", desc: "AYUSH, GMP & FDA approved products" },
  { icon: Truck, title: "Free Shipping", desc: "Free delivery on prepaid orders above ₹249" },
  { icon: IndianRupee, title: "COD Available", desc: "Cash on delivery across India" },
  { icon: Headphones, title: "24/7 Support", desc: "WhatsApp & call support anytime" },
];

export function WhyChoose() {
  return (
    <section className="py-14 sm:py-20 bg-gradient-cream">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-10">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3">
              Why Us?
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-foreground mb-3">
              Why Choose <span className="text-gradient-green">DARDGO?</span>
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto">
              Trusted by thousands for natural, effective wellness
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {reasons.map((r, i) => (
            <ScrollReveal key={r.title} delay={i * 0.08}>
              <div className="group bg-card rounded-3xl p-5 sm:p-6 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 border border-border/30 text-center h-full">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-primary/8 mx-auto mb-3 flex items-center justify-center group-hover:bg-primary/15 group-hover:scale-110 transition-all">
                  <r.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-sm sm:text-base text-foreground mb-1">{r.title}</h3>
                <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed">{r.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
