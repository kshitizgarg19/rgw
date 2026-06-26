"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { RotateCw } from "lucide-react";
import { clamp, cn } from "@/lib/utils";

export function Product3DViewer({
  images,
  name,
  accent,
}: {
  images: string[];
  name: string;
  accent: "mawa" | "pistachio";
}) {
  const [active, setActive] = useState(0);
  const [hint, setHint] = useState(true);
  const dragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });

  const rotYraw = useMotionValue(-12);
  const rotXraw = useMotionValue(8);
  const rotY = useSpring(rotYraw, { stiffness: 160, damping: 18 });
  const rotX = useSpring(rotXraw, { stiffness: 160, damping: 18 });

  const glareX = useTransform(rotY, [-40, 40], ["85%", "15%"]);
  const glareY = useTransform(rotX, [-25, 25], ["80%", "20%"]);
  const glare = useTransform(
    [glareX, glareY],
    ([gx, gy]) => `radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,0.55), transparent 55%)`
  );
  const shadowScale = useTransform(rotX, [-25, 25], [1.1, 0.85]);

  const glow = accent === "pistachio" ? "#9fb86a" : "#f0b44a";

  function onDown(e: React.PointerEvent) {
    dragging.current = true;
    last.current = { x: e.clientX, y: e.clientY };
    setHint(false);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  }
  function onMove(e: React.PointerEvent) {
    if (!dragging.current) return;
    const dx = e.clientX - last.current.x;
    const dy = e.clientY - last.current.y;
    last.current = { x: e.clientX, y: e.clientY };
    rotYraw.set(clamp(rotYraw.get() + dx * 0.6, -42, 42));
    rotXraw.set(clamp(rotXraw.get() - dy * 0.4, -26, 26));
  }
  function onUp() {
    dragging.current = false;
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div
        className="relative aspect-square w-full max-w-lg select-none overflow-hidden rounded-[2rem] bg-gradient-to-br from-[var(--color-espresso)] to-[var(--color-maroon-deep)] ring-1 ring-[var(--color-gold)]/30"
        style={{ perspective: 1100 }}
      >
        <div className="absolute inset-0 spotlight" />
        {/* ambient glow */}
        <div
          className="absolute left-1/2 top-1/2 h-3/5 w-3/5 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          style={{ background: glow, opacity: 0.45 }}
        />

        {/* pedestal floor glow + shadow */}
        <div className="absolute inset-x-[15%] bottom-[10%] h-10 rounded-[50%] bg-[var(--color-gold)]/20 blur-xl" />
        <motion.div
          style={{ scaleX: shadowScale }}
          className="absolute inset-x-[20%] bottom-[11%] h-6 rounded-[50%] bg-black/40 blur-lg"
        />

        {/* draggable 3D plane */}
        <motion.div
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerLeave={onUp}
          data-lenis-prevent
          style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }}
          className="absolute inset-0 cursor-grab touch-none active:cursor-grabbing"
        >
          <div className="animate-float relative h-full w-full p-[8%]">
            <div className="relative h-full w-full overflow-hidden rounded-2xl ring-1 ring-[var(--color-gold)]/30 shadow-[0_30px_60px_rgba(0,0,0,0.55)]">
              <Image
                src={images[active]}
                alt={name}
                fill
                priority
                sizes="(max-width:768px) 80vw, 36vw"
                className="object-cover"
              />
              {/* moving specular glare */}
              <motion.span
                aria-hidden
                className="pointer-events-none absolute inset-0 mix-blend-soft-light"
                style={{ background: glare }}
              />
            </div>
          </div>
        </motion.div>

        {/* drag hint */}
        {hint && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="pointer-events-none absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-[var(--color-maroon)]/80 px-3 py-1.5 text-xs font-medium text-[var(--color-cream)] backdrop-blur"
          >
            <RotateCw size={13} /> Drag to rotate
          </motion.div>
        )}
      </div>

      {/* angle thumbnails */}
      {images.length > 1 && (
        <div className="flex items-center gap-3">
          {images.map((img, i) => (
            <button
              key={img}
              onClick={() => setActive(i)}
              aria-label={`View ${name} angle ${i + 1}`}
              className={cn(
                "relative h-16 w-16 overflow-hidden rounded-xl ring-1 transition-all",
                i === active
                  ? "ring-2 ring-[var(--color-gold)] scale-105"
                  : "ring-[var(--color-gold)]/25 opacity-70 hover:opacity-100"
              )}
            >
              <Image src={img} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
