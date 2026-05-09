import { useEffect, useRef } from "react";
import { useRouterState } from "@tanstack/react-router";
import Lenis from "lenis";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/**
 * Mounts Lenis on the window for buttery global smooth scrolling and:
 *  - keeps Framer Motion's `useScroll`/`whileInView` in sync via the same RAF loop
 *  - resets scroll on route change so each page begins at the top
 *  - respects the user's `prefers-reduced-motion` preference (Lenis disables itself)
 *  - exposes the instance on `window.__lenis` so other components (modals, drawers)
 *    can call `stop()` / `start()` to lock the page during open state.
 *
 * Render this once inside the app shell — it produces no DOM, just side-effects.
 */
export function SmoothScrollProvider() {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // `lerp` mode (frame-rate based interpolation) feels more natural and
    // responsive than fixed-duration tweens — the page catches up to wheel
    // input quickly without ever feeling sticky/stuck.
    const lenis = new Lenis({
      lerp: 0.12,
      smoothWheel: !prefersReduced,
      // Native touch scrolling on mobile feels better than synthesized smoothness.
      syncTouch: false,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      gestureOrientation: "vertical",
      orientation: "vertical",
    });
    lenisRef.current = lenis;
    window.__lenis = lenis;

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
      delete window.__lenis;
    };
  }, []);

  // On route change, jump to the top instantly. Hash links keep their default behaviour.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash) return;
    const lenis = lenisRef.current;
    if (lenis) {
      lenis.scrollTo(0, { immediate: true, force: true });
    } else {
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    }
  }, [pathname]);

  return null;
}
