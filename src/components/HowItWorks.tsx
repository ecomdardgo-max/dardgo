export function HowItWorks() {
  const steps = [
    { num: "01", title: "Apply", desc: "Take a small amount and apply on the affected area" },
    { num: "02", title: "Massage", desc: "Gently massage in circular motions for 2-3 minutes" },
    { num: "03", title: "Relax", desc: "Feel the soothing relief within minutes" },
  ];

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold font-[var(--font-display)] text-foreground mb-4">
            How It <span className="text-primary">Works</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Simple 3-step process for effective pain relief
          </p>
        </div>
        <div className="grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((s, i) => (
            <div key={s.num} className="text-center relative">
              <div className="w-20 h-20 rounded-full bg-gradient-hero mx-auto mb-6 flex items-center justify-center shadow-brand">
                <span className="text-2xl font-bold" style={{ color: '#fff' }}>{s.num}</span>
              </div>
              <h3 className="text-xl font-semibold font-[var(--font-display)] text-foreground mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              {i < 2 && (
                <div className="hidden sm:block absolute top-10 left-[60%] w-[80%] border-t-2 border-dashed border-primary/20" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
