import { ScrollReveal } from "@/components/ScrollReveal";
import { Shield, Star, Users, Stethoscope } from "lucide-react";

const trustItems = [
  { icon: Users, value: "10,00,000+", label: "Happy Customers", color: "text-primary" },
  { icon: Star, value: "4.8/5", label: "Average Rating", color: "text-brand-yellow" },
  { icon: Stethoscope, value: "500+", label: "Doctor Recommended", color: "text-brand-orange" },
  { icon: Shield, value: "100%", label: "Natural & Safe", color: "text-brand-green-light" },
];

/**
 * Compact "trusted by" stat row.
 * - Mobile: single row of 4 tightly-packed pills (icon top, stat below).
 *   We use very small text to keep "10,00,000+" on one line at 320px.
 * - Tablet+: roomier horizontal cards.
 * Section vertical padding intentionally tight so the homepage stays dense
 * above the fold.
 */
export function TrustedBySection() {
  return (
    <section className="py-5 sm:py-9 lg:py-12 bg-gradient-cream">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="grid grid-cols-4 gap-1.5 sm:gap-4 lg:gap-6">
            {trustItems.map((item, i) => (
              <ScrollReveal key={item.label} delay={i * 0.06}>
                <div className="group flex flex-col sm:flex-row items-center sm:items-center text-center sm:text-left gap-1 sm:gap-3 bg-card rounded-xl sm:rounded-2xl px-1.5 py-2 sm:p-4 lg:p-5 shadow-soft hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300 border border-border/30 h-full">
                  <div className="w-7 h-7 sm:w-11 sm:h-11 lg:w-12 lg:h-12 rounded-lg sm:rounded-xl lg:rounded-2xl bg-primary/5 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors">
                    <item.icon
                      className={`w-3.5 h-3.5 sm:w-5 sm:h-5 ${item.color}`}
                      strokeWidth={2.2}
                    />
                  </div>
                  <div className="min-w-0 w-full">
                    <p className="text-[11px] sm:text-lg lg:text-2xl font-extrabold text-foreground tracking-tight leading-none whitespace-nowrap">
                      {item.value}
                    </p>
                    <p className="text-[9px] sm:text-[11px] lg:text-xs text-muted-foreground mt-0.5 sm:mt-1 leading-tight">
                      {item.label}
                    </p>
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
