"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

export function ConfirmationSeal() {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -40 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", damping: 11, stiffness: 180 }}
      className="relative mx-auto grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-[var(--color-gold-light)] to-[var(--color-gold-deep)] shadow-[0_12px_40px_-6px_rgba(196,154,63,0.6)]"
    >
      <span className="absolute inset-0 animate-ping rounded-full bg-[var(--color-gold)] opacity-20" />
      <motion.span
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.25, type: "spring", damping: 10 }}
      >
        <Check size={44} strokeWidth={3} className="text-[var(--color-maroon-deep)]" />
      </motion.span>
    </motion.div>
  );
}
