import { Star } from "lucide-react";

export function Testimonials() {
  return (
    <section className="py-16 sm:py-24 bg-brand-cream">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold font-[var(--font-display)] text-foreground mb-4">
            Customer <span className="text-primary">Reviews</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Real experiences from our valued customers
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card rounded-2xl p-6 border border-border/50">
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 text-muted-foreground/30" />
                ))}
              </div>
              <p className="text-muted-foreground italic mb-4 text-sm leading-relaxed">
                No reviews yet. Be the first to share your experience!
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <span className="text-sm text-muted-foreground">?</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Awaiting review</p>
                  <p className="text-xs text-muted-foreground">Verified Customer</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
