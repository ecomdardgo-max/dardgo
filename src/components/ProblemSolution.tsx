import { X, Check } from "lucide-react";

const problems = [
  "Constant joint pain & stiffness",
  "Back pain from long hours",
  "Chemical painkillers with side effects",
  "Temporary relief, pain comes back",
];

const solutions = [
  "Natural Ayurvedic pain relief",
  "Deep tissue muscle relaxation",
  "Zero chemicals, zero side effects",
  "Long-lasting relief at the root",
];

export function ProblemSolution() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold font-[var(--font-display)] text-foreground mb-4">
            The Problem & <span className="text-primary">Our Solution</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Say goodbye to chemical painkillers and embrace the power of Ayurveda
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-destructive/5 rounded-2xl p-8 border border-destructive/10">
            <h3 className="text-lg font-semibold text-destructive mb-6 font-[var(--font-display)]">❌ The Problem</h3>
            <ul className="space-y-4">
              {problems.map((p) => (
                <li key={p} className="flex items-start gap-3">
                  <X className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                  <span className="text-foreground/80">{p}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-primary/5 rounded-2xl p-8 border border-primary/10">
            <h3 className="text-lg font-semibold text-primary mb-6 font-[var(--font-display)]">✅ DARDGO Solution</h3>
            <ul className="space-y-4">
              {solutions.map((s) => (
                <li key={s} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-foreground/80">{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
