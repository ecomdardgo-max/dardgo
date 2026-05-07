import { Star } from "lucide-react";

export function Testimonials() {
  return (
    <section className="py-14 sm:py-20 bg-brand-cream">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-4xl font-bold font-[var(--font-display)] text-foreground mb-3">
            Customer <span className="text-primary">Reviews</span>
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            Real experiences from our valued customers
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card rounded-2xl p-5 sm:p-6 border border-border/40 hover:shadow-brand transition-all duration-300">
              <div className="flex gap-0.5 mb-3">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 text-muted-foreground/20" />
                ))}
              </div>
              <p className="text-muted-foreground italic text-sm leading-relaxed mb-4">
                No reviews yet. Be the first to share your experience!
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xs text-primary font-bold">?</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Awaiting review</p>
                  <p className="text-[11px] text-muted-foreground">Verified Customer</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
