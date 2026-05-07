export function HowItWorks() {
  const steps = [
    { num: "01", title: "Choose Product", desc: "Browse our range of Ayurvedic wellness products", emoji: "🌿" },
    { num: "02", title: "Apply / Use", desc: "Follow the simple usage instructions on the product", emoji: "✋" },
    { num: "03", title: "Feel the Relief", desc: "Experience natural Ayurvedic healing within minutes", emoji: "✨" },
  ];

  return (
    <section className="py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-4xl font-bold font-[var(--font-display)] text-foreground mb-3">
            How It <span className="text-primary">Works</span>
          </h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {steps.map((s, i) => (
            <div key={s.num} className="text-center relative">
              <div className="w-20 h-20 rounded-2xl bg-primary/10 mx-auto mb-5 flex items-center justify-center text-3xl">
                {s.emoji}
              </div>
              <div className="inline-block px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold mb-3">
                Step {s.num}
              </div>
              <h3 className="text-lg font-bold font-[var(--font-display)] text-foreground mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              {i < 2 && (
                <div className="hidden sm:block absolute top-10 left-[65%] w-[70%] border-t-2 border-dashed border-primary/20" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
