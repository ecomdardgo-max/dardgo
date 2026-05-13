import { ScrollReveal } from "@/components/ScrollReveal";

export function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Choose Your Product",
      desc: "Browse our curated range of Ayurvedic wellness products",
      emoji: "🛒",
      color: "bg-primary/10",
    },
    {
      num: "02",
      title: "Apply as Directed",
      desc: "Follow the simple usage instructions on the product label",
      emoji: "✋",
      color: "bg-brand-orange/10",
    },
    {
      num: "03",
      title: "Stay consistent",
      desc: "Track how you feel over weeks — wellness is a habit, not a one-day event",
      emoji: "✨",
      color: "bg-brand-yellow/10",
    },
  ];

  return (
    <section className="py-16 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-10 sm:mb-14 max-w-2xl mx-auto">
            <span className="text-eyebrow text-primary mb-4 block">— Simple steps</span>
            <h2 className="text-display-2 text-foreground mb-4">
              How it <span className="text-gradient-green">works</span>
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              Shop, follow the label, and build a steady routine — no prescription products sold
              here.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {steps.map((s, i) => (
            <ScrollReveal key={s.num} delay={i * 0.15}>
              <div className="text-center relative">
                <div
                  className={`w-20 h-20 rounded-3xl ${s.color} mx-auto mb-5 flex items-center justify-center text-3xl shadow-soft`}
                >
                  {s.emoji}
                </div>
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold mb-3">
                  Step {s.num}
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">
                  {s.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                {i < 2 && (
                  <div className="hidden sm:block absolute top-10 left-[65%] w-[70%] border-t-2 border-dashed border-primary/15" />
                )}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
