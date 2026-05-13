import { X, Check, Sparkles } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";

const problems = [
  "Busy schedules make self-care easy to skip",
  "Confusing claims make it hard to compare brands",
  "Hard to know what is marketing vs. evidence",
  "Inconsistent quality across herbal retail",
];

const solutions = [
  "Straightforward Ayurvedic-inspired products",
  "Clear usage notes and responsive customer care",
  "No disease-cure messaging — read our disclaimers",
  "Batch-focused manufacturing partners we audit",
];

export function ProblemSolution() {
  return (
    <section className="relative py-10 sm:py-14 lg:py-16 overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,hsl(var(--primary)/0.1),transparent_50%),radial-gradient(ellipse_60%_35%_at_100%_60%,hsl(var(--primary)/0.05),transparent_45%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border/60 to-transparent"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="mx-auto max-w-2xl text-center mb-8 sm:mb-10">
            <span className="text-eyebrow text-primary mb-2 inline-flex items-center justify-center gap-1.5">
              <Sparkles className="w-3 h-3 opacity-80" aria-hidden />
              Honest retail
            </span>
            <h2 className="text-display-3 text-foreground mb-3 tracking-tight">
              Modern life &{" "}
              <span className="text-gradient-green bg-clip-text text-transparent">
                thoughtful wellness
              </span>
            </h2>
            <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed max-w-xl mx-auto">
              Many people look for herbal support alongside movement, nutrition, and professional
              guidance — we aim to meet you there with honest retail experiences.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-4 lg:gap-5 max-w-4xl mx-auto items-stretch">
          <ScrollReveal delay={0.06}>
            <div className="relative h-full flex flex-col rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm shadow-card hover:shadow-card-hover transition-shadow duration-300 overflow-hidden">
              <div
                className="h-0.5 w-full bg-gradient-to-r from-destructive/10 via-destructive/35 to-destructive/10"
                aria-hidden
              />
              <div className="p-5 sm:p-6 flex flex-col flex-1">
                <div className="flex items-center gap-2.5 mb-4">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-destructive/10 text-destructive ring-1 ring-destructive/12">
                    <X className="w-4 h-4 stroke-[2.5]" strokeLinecap="round" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[9px] uppercase tracking-[0.18em] text-muted-foreground font-semibold">
                      Reality check
                    </p>
                    <h3 className="text-base sm:text-lg font-bold font-[var(--font-display)] text-foreground leading-tight">
                      Common friction
                    </h3>
                  </div>
                </div>
                <ul className="space-y-2 flex-1">
                  {problems.map((p) => (
                    <li
                      key={p}
                      className="flex gap-2.5 rounded-xl border border-border/30 bg-background/50 px-3 py-2 sm:py-2.5 transition-colors hover:border-destructive/20 hover:bg-destructive/[0.03]"
                    >
                      <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-destructive/10 text-destructive">
                        <X className="w-3 h-3 stroke-[2.5]" aria-hidden />
                      </span>
                      <span className="text-xs sm:text-sm leading-snug text-foreground/88 pt-0.5">
                        {p}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.12}>
            <div className="relative h-full flex flex-col rounded-2xl border border-primary/18 bg-gradient-to-br from-primary/[0.06] via-card/85 to-card/95 backdrop-blur-sm shadow-[0_6px_28px_-10px_hsl(var(--primary)/0.22)] hover:shadow-[0_8px_32px_-10px_hsl(var(--primary)/0.28)] transition-shadow duration-300 overflow-hidden">
              <div
                className="h-0.5 w-full bg-gradient-to-r from-primary/25 via-primary to-primary/25"
                aria-hidden
              />
              <div className="p-5 sm:p-6 flex flex-col flex-1">
                <div className="flex items-center gap-2.5 mb-4">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/12 text-primary ring-1 ring-primary/18">
                    <Check
                      className="w-4 h-4 stroke-[2.5]"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[9px] uppercase tracking-[0.18em] text-primary/75 font-semibold">
                      Our approach
                    </p>
                    <h3 className="text-base sm:text-lg font-bold font-[var(--font-display)] text-foreground leading-tight">
                      How DARDGO helps
                    </h3>
                  </div>
                </div>
                <ul className="space-y-2 flex-1">
                  {solutions.map((s) => (
                    <li
                      key={s}
                      className="flex gap-2.5 rounded-xl border border-primary/12 bg-background/45 px-3 py-2 sm:py-2.5 transition-colors hover:border-primary/28 hover:bg-primary/[0.05]"
                    >
                      <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-primary/12 text-primary">
                        <Check className="w-3 h-3 stroke-[2.5]" aria-hidden />
                      </span>
                      <span className="text-xs sm:text-sm leading-snug text-foreground/88 pt-0.5">
                        {s}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
