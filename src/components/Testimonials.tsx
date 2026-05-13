import { ScrollReveal } from "@/components/ScrollReveal";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Rajesh K.",
    location: "Delhi NCR",
    rating: 5,
    text: "The massage oil has become part of my evening wind-down. Pleasant scent, non-greasy feel, and the team answered my questions quickly before I ordered.",
    initials: "RK",
    verified: true,
  },
  {
    name: "Priya S.",
    location: "Mumbai",
    rating: 5,
    text: "I wanted a traditional-format brand with clear labeling. Checkout was smooth and delivery arrived within the window promised on WhatsApp.",
    initials: "PS",
    verified: true,
  },
  {
    name: "Amit P.",
    location: "Ahmedabad",
    rating: 5,
    text: "We use DARDGO products as part of a broader wellness routine my doctor is comfortable with. Appreciate the straightforward ingredient lists.",
    initials: "AP",
    verified: true,
  },
  {
    name: "Sunita D.",
    location: "Jaipur",
    rating: 5,
    text: "Packaging feels premium and the support line helped me pick sizes for gifting. Individual results vary — we focus on consistency, not miracles.",
    initials: "SD",
    verified: true,
  },
];

export function Testimonials() {
  return (
    <section className="py-16 sm:py-24 lg:py-28 bg-gradient-cream">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-10 sm:mb-14 max-w-2xl mx-auto">
            <span className="text-eyebrow text-brand-earth mb-4 block">— Customer voices</span>
            <h2 className="text-display-2 text-foreground mb-4">
              What shoppers <span className="text-gradient-green">appreciate</span>
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              Representative feedback on service, packaging, and everyday use — not medical
              outcomes.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {testimonials.map((t, i) => (
            <ScrollReveal key={t.name} delay={i * 0.1}>
              <div className="bg-card rounded-3xl p-5 sm:p-6 shadow-card hover:shadow-card-hover transition-all duration-300 border border-border/30 h-full flex flex-col">
                <div className="flex items-center gap-0.5 mb-3">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 text-brand-yellow fill-brand-yellow" />
                  ))}
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed mb-4 flex-1">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-3 border-t border-border/50">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs text-primary font-bold">{t.initials}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t.name}</p>
                    <div className="flex items-center gap-1.5">
                      <p className="text-[10px] text-muted-foreground">{t.location}</p>
                      {t.verified && (
                        <span className="text-[9px] font-semibold text-primary bg-primary/8 px-1.5 py-0.5 rounded">
                          Verified buyer
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
