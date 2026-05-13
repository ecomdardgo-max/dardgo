import { useRef } from "react";
import { motion, useInView, useReducedMotion, type Variants } from "framer-motion";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  duration?: number;
  once?: boolean;
  /** Distance in px the element travels in. */
  distance?: number;
  /** When true, child elements are staggered in. */
  stagger?: boolean;
}

/**
 * Reveals its children with a smooth fade + translate as they scroll into view.
 *
 * - Honours `prefers-reduced-motion` (renders content statically).
 * - Triggers as soon as ~15 % of the element enters the viewport — feels natural
 *   without ever leaving content stranded invisible on tall sections.
 * - When `stagger` is true, direct children animate in sequence.
 */
export function ScrollReveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
  duration = 0.6,
  once = true,
  distance,
  stagger = false,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once, amount: 0.15 });
  const shouldReduceMotion = useReducedMotion();

  const travel = distance ?? (direction === "left" || direction === "right" ? 40 : 28);
  const directionMap = {
    up: { y: travel, x: 0 },
    down: { y: -travel, x: 0 },
    left: { x: travel, y: 0 },
    right: { x: -travel, y: 0 },
    none: { x: 0, y: 0 },
  } as const;
  const { x, y } = directionMap[direction];

  // Reduced-motion users get content immediately, no transitions.
  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  if (stagger) {
    const containerVariants: Variants = {
      hidden: {},
      visible: {
        transition: {
          delayChildren: delay,
          staggerChildren: 0.08,
        },
      },
    };
    const itemVariants: Variants = {
      hidden: { opacity: 0, x, y },
      visible: {
        opacity: 1,
        x: 0,
        y: 0,
        transition: { duration, ease: [0.22, 1, 0.36, 1] },
      },
    };

    return (
      <motion.div
        ref={ref}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={containerVariants}
        className={className}
      >
        {Array.isArray(children) ? (
          children.map((child, i) => (
            <motion.div key={i} variants={itemVariants} data-reveal-child>
              {child}
            </motion.div>
          ))
        ) : (
          <motion.div variants={itemVariants} data-reveal-child>
            {children}
          </motion.div>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x, y }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x, y }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
