import { motion, useScroll, useSpring } from "framer-motion";

/**
 * Thin gradient progress bar fixed to the top of the viewport that fills
 * as the user scrolls down the page. Uses Framer's spring to feel buttery,
 * and stays visually quiet so it never competes with the navbar content.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 24,
    mass: 0.35,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed left-0 right-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-brand-yellow via-primary to-brand-green-light"
    />
  );
}
