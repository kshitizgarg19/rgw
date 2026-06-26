"use client";

import { cn } from "@/lib/utils";

type P = {
  left: number;
  top: number;
  size: number;
  delay: number;
  dur: number;
  kind: "pista" | "almond" | "cardamom" | "petal" | "gold";
};

// Deterministic layout (no Math.random) to avoid hydration mismatch.
const PARTICLES: P[] = [
  { left: 6, top: 18, size: 16, delay: 0, dur: 17, kind: "pista" },
  { left: 14, top: 70, size: 11, delay: 2.5, dur: 21, kind: "gold" },
  { left: 22, top: 40, size: 20, delay: 1.2, dur: 19, kind: "petal" },
  { left: 33, top: 82, size: 13, delay: 4, dur: 23, kind: "almond" },
  { left: 44, top: 12, size: 10, delay: 0.6, dur: 18, kind: "cardamom" },
  { left: 52, top: 60, size: 15, delay: 3.1, dur: 22, kind: "pista" },
  { left: 63, top: 30, size: 12, delay: 1.8, dur: 20, kind: "gold" },
  { left: 71, top: 76, size: 18, delay: 2.2, dur: 24, kind: "petal" },
  { left: 80, top: 22, size: 14, delay: 0.3, dur: 19, kind: "almond" },
  { left: 88, top: 55, size: 11, delay: 3.6, dur: 21, kind: "cardamom" },
  { left: 94, top: 84, size: 16, delay: 1.4, dur: 23, kind: "pista" },
  { left: 38, top: 50, size: 9, delay: 5, dur: 26, kind: "gold" },
];

const STYLES: Record<P["kind"], React.CSSProperties> = {
  pista: { background: "linear-gradient(135deg,#bcd189,#7e9a48)", borderRadius: "60% 40% 55% 45%" },
  almond: { background: "linear-gradient(135deg,#e7c089,#c8924f)", borderRadius: "60% 60% 50% 50% / 70% 70% 40% 40%" },
  cardamom: { background: "linear-gradient(135deg,#a7bd72,#6f8a42)", borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%" },
  petal: { background: "radial-gradient(circle at 30% 30%,#f3a9b8,#d24f67)", borderRadius: "0 60% 60% 60%" },
  gold: { background: "radial-gradient(circle at 35% 35%,#f3da8c,#c49a3f)", borderRadius: "50%" },
};

export function AmbientParticles({ className }: { className?: string }) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden>
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className="absolute animate-drift opacity-60 will-change-transform"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            animationDuration: `${p.dur}s`,
            animationDelay: `${p.delay}s`,
            boxShadow: "0 2px 6px rgba(58,13,22,0.12)",
            ...STYLES[p.kind],
          }}
        />
      ))}
    </div>
  );
}
