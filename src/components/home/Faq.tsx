"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FAQS } from "@/lib/constants";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="relative mx-auto max-w-3xl px-6 py-24">
      <SectionHeading eyebrow="Good to Know" title="Frequently asked questions" />

      <div className="mt-12 flex flex-col gap-3">
        {FAQS.map((faq, i) => {
          const isOpen = open === i;
          return (
            <div
              key={faq.q}
              className="card-lux overflow-hidden transition-shadow duration-300"
            >
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
              >
                <span className="font-serif text-lg font-semibold text-[var(--color-maroon)]">
                  {faq.q}
                </span>
                <motion.span
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[var(--color-gold)]/15 text-[var(--color-gold-deep)]"
                >
                  <Plus size={18} />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <p className="px-6 pb-5 leading-relaxed text-[var(--color-ink-soft)]">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
