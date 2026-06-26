"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { useProducts } from "@/lib/useProducts";
import { formatINR } from "@/lib/utils";

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const products = useProducts();
  const [q, setQ] = useState("");

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.shortDescription.toLowerCase().includes(term) ||
        p.ingredients.some((i) => i.toLowerCase().includes(term))
    );
  }, [q, products]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[200] flex justify-center bg-[var(--color-maroon-deep)]/55 px-4 pt-24 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="h-fit w-full max-w-2xl"
          >
            <div className="card-lux overflow-hidden p-2">
              <div className="flex items-center gap-3 px-4 py-3">
                <Search size={22} className="text-[var(--color-gold-deep)]" />
                <input
                  autoFocus
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search our sweets…"
                  className="flex-1 bg-transparent text-lg text-[var(--color-ink)] placeholder:text-[var(--color-ink-faint)] focus:outline-none"
                />
                <button onClick={onClose} aria-label="Close search" className="text-[var(--color-ink-soft)] hover:text-[var(--color-maroon)]">
                  <X size={22} />
                </button>
              </div>

              <div className="border-t border-[var(--color-gold)]/20 p-2">
                {results.length === 0 ? (
                  <p className="px-4 py-8 text-center text-[var(--color-ink-soft)]">
                    No sweets match “{q}”.
                  </p>
                ) : (
                  <ul className="flex flex-col gap-1">
                    {results.map((p) => (
                      <li key={p.slug}>
                        <Link
                          href={`/product/${p.slug}`}
                          onClick={onClose}
                          className="flex items-center gap-4 rounded-xl p-2 transition-colors hover:bg-[var(--color-gold)]/10"
                        >
                          <Image
                            src={p.images[0]}
                            alt={p.name}
                            width={56}
                            height={56}
                            className="h-14 w-14 rounded-lg object-cover"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="font-serif text-base font-bold text-[var(--color-maroon)]">{p.name}</p>
                            <p className="truncate text-sm text-[var(--color-ink-soft)]">{p.shortDescription}</p>
                          </div>
                          <span className="shrink-0 font-semibold text-[var(--color-gold-deep)]">
                            {formatINR(p.price)}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
