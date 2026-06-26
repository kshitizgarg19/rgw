"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

export function Loader() {
  const pathname = usePathname();
  const [done, setDone] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = setTimeout(() => setDone(true), reduce ? 200 : 1800);
    return () => clearTimeout(t);
  }, []);

  if (pathname?.startsWith("/rgw-admin")) return null;

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[500] grid place-items-center bg-gradient-to-b from-[var(--color-maroon)] to-[var(--color-maroon-deep)]"
        >
          <div className="flex flex-col items-center">
            <div className="relative h-32 w-32">
              <svg viewBox="0 0 120 120" className="absolute inset-0 -rotate-90">
                <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(230,199,114,0.15)" strokeWidth="2" />
                <motion.circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke="var(--color-gold-light)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray="339"
                  initial={{ strokeDashoffset: 339 }}
                  animate={{ strokeDashoffset: 0 }}
                  transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
                />
              </svg>
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 grid place-items-center"
              >
                <span className="inline-flex items-center justify-center rounded-2xl bg-white px-3 py-2.5 shadow-lg">
                  <Image
                    src="/brand/rgw-logo.png"
                    alt="Rajender Mittal — Gajar Pak Wale"
                    width={1234}
                    height={838}
                    priority
                    className="h-12 w-auto object-contain"
                  />
                </span>
              </motion.div>
            </div>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.7 }}
              className="mt-6 text-[0.7rem] uppercase tracking-[0.4em] text-[var(--color-gold-light)]"
            >
              Traditional Mithai Since 1950
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
