"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown, MessageCircle, ShoppingBag } from "lucide-react";
import { AmbientParticles } from "./AmbientParticles";
import { whatsappLink } from "@/lib/constants";
import { scrollToId } from "@/components/providers/SmoothScroll";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const sceneY = useTransform(scrollYProgress, [0, 1], [0, 110]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const prodY = useTransform(scrollYProgress, [0, 1], [0, -130]);
  const prodScale = useTransform(scrollYProgress, [0, 1], [1, 1.14]);

  return (
    <section ref={ref} className="dark-panel relative min-h-[100svh] overflow-hidden">
      {/* faint shop interior, glowing through the dark */}
      <motion.div style={{ y: sceneY }} className="absolute inset-0 -z-10">
        <Image
          src="/brand/shop-scene.svg"
          alt=""
          fill
          priority
          className="object-cover object-bottom opacity-25 mix-blend-screen"
        />
      </motion.div>

      {/* golden spotlight pool */}
      <div className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-[70vh] w-[70vw] -translate-x-1/2 -translate-y-1/4 rounded-full bg-[radial-gradient(circle,rgba(242,181,74,0.28),transparent_60%)] blur-2xl" />
      {/* vignette */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(130%_120%_at_50%_40%,transparent_45%,rgba(27,12,10,0.7)_100%)]" />

      <AmbientParticles />

      <div className="relative mx-auto grid min-h-[100svh] max-w-7xl items-center gap-10 px-6 pb-24 pt-32 lg:grid-cols-[1.05fr_0.95fr]">
        {/* Copy */}
        <motion.div style={{ y: textY, opacity: textOpacity }} className="z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-[var(--color-gold)]/40 bg-[var(--color-espresso)]/40 px-4 py-1.5 backdrop-blur"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-gold-light)]" />
            <span className="eyebrow !tracking-[0.28em]">Est. 1950 · Samalkha, Haryana</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1, ease: EASE }}
            className="font-display text-[clamp(3rem,7vw,5.6rem)] font-medium leading-[0.98] tracking-[-0.01em] text-[var(--color-cream)]"
          >
            75 Years of
            <br />
            <span className="text-foil italic">Authentic Mithai</span>
            <br />
            Making
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.25, ease: EASE }}
            className="mt-7 max-w-xl text-lg leading-relaxed text-[var(--color-cream)]/75"
          >
            Freshly prepared Mawa Barfi and Ghiya Barfi, crafted with premium
            ingredients and traditional family recipes since 1950.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.38, ease: EASE }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Link href="/shop" className="btn-gold">
              <ShoppingBag size={18} /> Shop Now
            </Link>
            <button
              onClick={() => scrollToId("featured")}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--color-gold)]/45 bg-white/5 px-7 py-[0.85rem] font-semibold text-[var(--color-cream)] backdrop-blur transition-all duration-300 hover:border-[var(--color-gold)] hover:bg-white/10"
            >
              View Products
            </button>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-[#4ad07f]/40 px-7 py-[0.85rem] font-semibold text-[#7fe3a6] transition-all duration-300 hover:border-[#4ad07f] hover:bg-[#25d366]/10"
            >
              <MessageCircle size={18} /> WhatsApp Us
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[var(--color-cream)]/60"
          >
            <span className="font-semibold text-[var(--color-gold-light)]">Starting at ₹750 / kg</span>
            <Dot /> <span>Fourth-generation halwais</span>
            <Dot /> <span>Fresh across Delhi NCR</span>
          </motion.div>
        </motion.div>

        {/* Spotlit products */}
        <motion.div style={{ y: prodY, scale: prodScale }} className="relative hidden h-[520px] lg:block">
          <FloatingProduct src="/products/mawa-barfi.jpg" alt="Mawa Barfi" className="left-0 top-0 z-10 w-[54%] rotate-[-6deg]" delay={0.4} glow="#f0b44a" />
          <FloatingProduct src="/products/ghiya-barfi.jpg" alt="Ghiya Barfi" className="bottom-0 right-0 z-20 w-[54%] rotate-[6deg]" delay={0.6} glow="#a6c06f" />
        </motion.div>
      </div>

      {/* scroll cue */}
      <motion.button
        onClick={() => scrollToId("featured")}
        aria-label="Scroll to products"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1 text-[var(--color-gold-light)]/80"
      >
        <span className="text-[0.62rem] uppercase tracking-[0.35em]">Step Inside</span>
        <motion.span animate={{ y: [0, 8, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}>
          <ChevronDown size={22} />
        </motion.span>
      </motion.button>

      {/* fade into the cream content below */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-[var(--color-cream)]" />
    </section>
  );
}

function FloatingProduct({
  src,
  alt,
  className,
  delay,
  glow,
}: {
  src: string;
  alt: string;
  className: string;
  delay: number;
  glow: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1, delay, ease: EASE }}
      className={`absolute ${className}`}
    >
      <div className="animate-float relative">
        <div className="absolute -inset-6 rounded-[42%] blur-3xl" style={{ background: glow, opacity: 0.4 }} />
        <div className="relative aspect-[3/4] overflow-hidden rounded-2xl ring-1 ring-[var(--color-gold)]/40 shadow-[0_36px_60px_rgba(0,0,0,0.6)]">
          <Image src={src} alt={alt} fill priority sizes="40vw" className="object-cover" />
        </div>
      </div>
    </motion.div>
  );
}

function Dot() {
  return <span className="hidden h-1 w-1 rounded-full bg-[var(--color-gold)] sm:inline-block" />;
}
