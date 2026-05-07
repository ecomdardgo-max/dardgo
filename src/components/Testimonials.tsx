import { ScrollReveal } from "@/components/ScrollReveal";
import { Star, Play } from "lucide-react";

const testimonials = [
  {
    name: "Rajesh Kumar",
    location: "Delhi",
    rating: 5,
    text: "DARDGO Pain Relief Oil gave me instant relief from my chronic back pain. I've tried many products but nothing works like this. Highly recommended!",
    initials: "RK",
    verified: true,
  },
  {
    name: "Priya Sharma",
    location: "Mumbai",
    rating: 5,
    text: "As a working professional, I used to suffer from neck and shoulder pain daily. After using DARDGO for 2 weeks, the pain is almost gone. Amazing product!",
    initials: "PS",
    verified: true,
  },
  {
    name: "Amit Patel",
    location: "Ahmedabad",
    rating: 5,
    text: "My father has been using DARDGO for his joint pain. The results are incredible — he can walk comfortably now. Thank you DARDGO!",
    initials: "AP",
    verified: true,
  },
  {
    name: "Sunita Devi",
    location: "Jaipur",
    rating: 5,
    text: "Being 100% Ayurvedic, I feel safe using DARDGO products for my family. No chemicals, no side effects. Best pain relief brand in India!",
    initials: "SD",
    verified: true,
  },
];

export function Testimonials() {
  return (
    <section className="py-14 sm:py-20 bg-gradient-cream">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-10">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-brand-yellow/10 text-brand-earth text-xs font-semibold mb-3">
              ⭐ Customer Love
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-foreground mb-3">
              What Our <span className="text-gradient-green">Customers</span> Say
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto">
              Real reviews from verified customers across India
            </p>
          </div>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {testimonials.map((t, i) => (
            <ScrollReveal key={t.name} delay={i * 0.1}>
              <div className="bg-card rounded-3xl p-5 sm:p-6 shadow-card hover:shadow-card-hover transition-all duration-300 border border-border/30 h-full flex flex-col">
                <div className="flex items-center gap-0.5 mb-3">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 text-brand-yellow fill-brand-yellow" />
                  ))}
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed mb-4 flex-1">
                  "{t.text}"
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
                        <span className="text-[9px] font-semibold text-primary bg-primary/8 px-1.5 py-0.5 rounded">Verified</span>
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
