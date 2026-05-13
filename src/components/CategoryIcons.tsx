import { Droplets, Pill, Sparkles, Leaf, FlaskConical, Candy } from "lucide-react";

const categories = [
  { icon: Droplets, label: "Wellness oils", color: "text-primary" },
  { icon: Pill, label: "Ayurvedic tablets", color: "text-primary" },
  { icon: Sparkles, label: "Beauty", color: "text-primary" },
  { icon: Candy, label: "Halwa", color: "text-primary" },
  { icon: FlaskConical, label: "Powders", color: "text-primary" },
  { icon: Leaf, label: "Capsules", color: "text-primary" },
];

export function CategoryIcons() {
  return (
    <section className="py-5 sm:py-6 border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide pb-2 justify-start sm:justify-center">
          {categories.map((cat) => (
            <a
              key={cat.label}
              href="#products"
              className="flex flex-col items-center gap-2 min-w-[72px] sm:min-w-[90px] group"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-primary/20 bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 group-hover:border-primary/40 transition-all duration-300 group-hover:scale-105">
                <cat.icon className={`w-6 h-6 sm:w-7 sm:h-7 ${cat.color}`} />
              </div>
              <span className="text-[10px] sm:text-xs font-semibold text-foreground/70 text-center leading-tight group-hover:text-primary transition-colors">
                {cat.label}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
