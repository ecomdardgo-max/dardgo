import { Link } from "@tanstack/react-router";
import { Droplets, Pill, Sparkles, Leaf, FlaskConical, Candy } from "lucide-react";
import { CATALOG_SECTIONS } from "@/lib/product-catalog";

const iconBySection: Record<string, typeof Droplets> = {
  "wellness-oil-balm": Droplets,
  "joint-mobility": Pill,
  "immunity-wellness": Candy,
  "digestive-wellness": FlaskConical,
  "beauty-personal-care": Sparkles,
  "health-wellness-support": Leaf,
};

export function CategoryIcons() {
  return (
    <section className="py-5 sm:py-6 border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide pb-2 justify-start sm:justify-center">
          {CATALOG_SECTIONS.map((cat) => {
            const Icon = iconBySection[cat.id] ?? Droplets;
            return (
              <Link
                key={cat.id}
                to="/collections/$handle"
                params={{ handle: cat.collectionHandle }}
                className="flex flex-col items-center gap-2 min-w-[72px] sm:min-w-[90px] group"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-primary/20 bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 group-hover:border-primary/40 transition-all duration-300 group-hover:scale-105">
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
                </div>
                <span className="text-[10px] sm:text-xs font-semibold text-foreground/70 text-center leading-tight group-hover:text-primary transition-colors max-w-[88px]">
                  {cat.title}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
