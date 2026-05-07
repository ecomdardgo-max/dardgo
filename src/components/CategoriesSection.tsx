import { ScrollReveal } from "@/components/ScrollReveal";
import { Droplets, Bone, Shield, Flower2, Dumbbell, Sparkles } from "lucide-react";

const categories = [
  { icon: Droplets, label: "Pain Relief", desc: "Oils & Roll-Ons", gradient: "from-emerald-50 to-green-50", iconColor: "text-primary" },
  { icon: Bone, label: "Joint Care", desc: "Tablets & Capsules", gradient: "from-amber-50 to-yellow-50", iconColor: "text-brand-orange" },
  { icon: Shield, label: "Immunity", desc: "Boosters & Tonics", gradient: "from-blue-50 to-cyan-50", iconColor: "text-blue-600" },
  { icon: Flower2, label: "Digestive Care", desc: "Churna & Syrups", gradient: "from-orange-50 to-red-50", iconColor: "text-brand-earth" },
  { icon: Sparkles, label: "Women Wellness", desc: "Health & Beauty", gradient: "from-pink-50 to-rose-50", iconColor: "text-pink-600" },
  { icon: Dumbbell, label: "Men Wellness", desc: "Strength & Vitality", gradient: "from-indigo-50 to-purple-50", iconColor: "text-indigo-600" },
];

export function CategoriesSection() {
  return (
    <section className="py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-10">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3">
              Browse Categories
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-foreground mb-3">
              Shop by <span className="text-gradient-green">Category</span>
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto">
              Find the perfect Ayurvedic solution for your health needs
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, i) => (
            <ScrollReveal key={cat.label} delay={i * 0.08}>
              <a
                href="#products"
                className={`group flex flex-col items-center text-center p-5 sm:p-6 rounded-3xl bg-gradient-to-br ${cat.gradient} hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 border border-border/30`}
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/80 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-soft">
                  <cat.icon className={`w-6 h-6 sm:w-7 sm:h-7 ${cat.iconColor}`} />
                </div>
                <h3 className="font-semibold text-sm text-foreground mb-0.5">{cat.label}</h3>
                <p className="text-[10px] text-muted-foreground">{cat.desc}</p>
              </a>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
