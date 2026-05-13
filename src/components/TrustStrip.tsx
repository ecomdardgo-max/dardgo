import { Shield, Leaf, FlaskConical, BadgeCheck, Award, Beaker } from "lucide-react";
import { motion } from "framer-motion";

const badges = [
  { icon: Leaf, label: "AYUSH-oriented" },
  { icon: BadgeCheck, label: "ISO 9001" },
  { icon: FlaskConical, label: "GMP-focused" },
  { icon: Shield, label: "Lab tested" },
  { icon: Award, label: "Herbal-first" },
  { icon: Beaker, label: "Batch QC" },
];

export function TrustStrip() {
  return (
    <section className="bg-gradient-hero py-2 sm:py-2.5">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        {/* Single tight row on all sizes — 3 cols on mobile (2 rows of 3),
            6 cols on tablet+. Compact heights so the strip never dominates
            the hero section. */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } },
          }}
          className="grid grid-cols-3 sm:grid-cols-6 gap-x-1.5 gap-y-1.5 sm:gap-x-3"
        >
          {badges.map((b) => (
            <motion.div
              key={b.label}
              variants={{
                hidden: { opacity: 0, y: 8 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
                },
              }}
              className="flex items-center justify-center gap-1 sm:gap-1.5 min-w-0"
            >
              <b.icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-brand-yellow flex-shrink-0" />
              <span className="text-[10px] sm:text-[12px] font-semibold text-primary-foreground/95 leading-none truncate">
                {b.label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
