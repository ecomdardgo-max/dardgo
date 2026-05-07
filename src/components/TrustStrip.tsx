import { Shield, Leaf, FlaskConical, BadgeCheck, Award, Beaker } from "lucide-react";

const badges = [
  { icon: Leaf, label: "AYUSH Certified" },
  { icon: BadgeCheck, label: "ISO 9001" },
  { icon: FlaskConical, label: "GMP Certified" },
  { icon: Shield, label: "FDA Approved" },
  { icon: Award, label: "100% Natural" },
  { icon: Beaker, label: "Lab Tested" },
];

export function TrustStrip() {
  return (
    <section className="bg-gradient-hero py-4 sm:py-5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-5 sm:gap-8 lg:gap-10 overflow-x-auto scrollbar-hide">
          {badges.map((b) => (
            <div key={b.label} className="flex items-center gap-2 min-w-fit">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/12 flex items-center justify-center">
                <b.icon className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-brand-yellow" />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-primary-foreground whitespace-nowrap">{b.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
