"use client";

import { useEffect } from "react";
import Lenis from "lenis";

type LenisGlobal = { lenis?: Lenis };
const lenisGlobal = () => window as unknown as LenisGlobal;

/** Momentum / "buttery" smooth scrolling. Disabled for reduced-motion users. */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
    });
    lenisGlobal().lenis = lenis;

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      lenisGlobal().lenis = undefined;
    };
  }, []);

  return <>{children}</>;
}

/** Smoothly scroll to an element id, falling back to native scroll. */
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const lenis = typeof window !== "undefined" ? lenisGlobal().lenis : undefined;
  if (lenis) {
    lenis.scrollTo(el, { offset: -80, duration: 1.4 });
  } else {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}
