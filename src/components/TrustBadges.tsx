import { Shield, Leaf, Award, MapPin } from "lucide-react";

const badges = [
  { icon: Leaf, title: "100% Natural", desc: "Pure Ayurvedic ingredients" },
  { icon: Shield, title: "Safe & Tested", desc: "Clinically verified formula" },
  { icon: Award, title: "Trusted Brand", desc: "Thousands of happy customers" },
  { icon: MapPin, title: "Made in India", desc: "Proudly Indian heritage" },
];

export function TrustBadges() {
  return (
    <section className="py-12 sm:py-16 bg-brand-cream">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {badges.map((b) => (
            <div key={b.title} className="flex flex-col items-center text-center gap-3 p-4">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                <b.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-sm sm:text-base text-foreground">{b.title}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
