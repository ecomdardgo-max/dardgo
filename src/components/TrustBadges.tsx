import { Shield, Leaf, Award, MapPin, FlaskConical, BadgeCheck } from "lucide-react";

const badges = [
  { icon: Leaf, title: "AYUSH Certified", desc: "Government approved Ayurvedic" },
  { icon: BadgeCheck, title: "ISO 9001", desc: "Quality management certified" },
  { icon: FlaskConical, title: "GMP Certified", desc: "Good Manufacturing Practice" },
  { icon: Shield, title: "FDA Approved", desc: "Safe & tested products" },
  { icon: Award, title: "100% Natural", desc: "Pure herbal ingredients" },
  { icon: MapPin, title: "Made in India", desc: "Proudly Indian brand" },
];

export function TrustBadges() {
  return (
    <section className="py-10 sm:py-14 bg-brand-cream border-y border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-xl sm:text-2xl font-bold font-[var(--font-display)] text-foreground mb-8">
          DardGo Super Safe Standards
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
          {badges.map((b) => (
            <div key={b.title} className="flex flex-col items-center text-center gap-2 p-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <b.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-xs sm:text-sm text-foreground">{b.title}</h3>
              <p className="text-xs text-muted-foreground">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
