import { ScrollReveal } from "@/components/ScrollReveal";
import { Shield, Star, Users, Stethoscope } from "lucide-react";

const trustItems = [
  { icon: Users, value: "10,00,000+", label: "Happy Customers", color: "text-primary" },
  { icon: Star, value: "4.8/5", label: "Average Rating", color: "text-brand-yellow" },
  { icon: Stethoscope, value: "500+", label: "Doctor Recommended", color: "text-brand-orange" },
  { icon: Shield, value: "100%", label: "Natural & Safe", color: "text-brand-green-light" },
];

export function TrustedBySection() {
  return (
    <section className="py-10 sm:py-14 bg-gradient-cream">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {trustItems.map((item, i) => (
              <ScrollReveal key={item.label} delay={i * 0.1}>
                <div className="flex items-center gap-3 sm:gap-4 bg-card rounded-2xl p-4 sm:p-5 shadow-card hover:shadow-card-hover transition-all duration-300">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-primary/5 flex items-center justify-center flex-shrink-0">
                    <item.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${item.color}`} />
                  </div>
                  <div>
                    <p className="text-lg sm:text-xl font-bold text-foreground">{item.value}</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">{item.label}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
