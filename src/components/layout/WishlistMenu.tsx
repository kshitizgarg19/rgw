"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Plus, X } from "lucide-react";
import { useWishlist } from "@/components/providers/WishlistProvider";
import { useCart } from "@/components/providers/CartProvider";
import { useProducts, cartFields } from "@/lib/useProducts";
import { useToast } from "@/components/providers/ToastProvider";
import { formatINR } from "@/lib/utils";

export function WishlistMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, toggle } = useWishlist();
  const { addItem } = useCart();
  const { toast } = useToast();
  const products = useProducts();

  const saved = products.filter((p) => items.includes(p.slug));

  return (
    <AnimatePresence>
      {open && (
        <>
          <div className="fixed inset-0 z-[110]" onClick={onClose} aria-hidden />
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="glass absolute right-0 top-12 z-[130] w-[min(88vw,340px)] rounded-2xl p-3 shadow-[0_20px_50px_rgba(58,13,22,0.2)]"
          >
            <div className="mb-2 flex items-center justify-between px-1">
              <p className="font-serif text-base font-bold text-[var(--color-maroon)]">Your Wishlist</p>
              <button onClick={onClose} aria-label="Close" className="text-[var(--color-ink-soft)] hover:text-[var(--color-maroon)]">
                <X size={16} />
              </button>
            </div>

            {saved.length === 0 ? (
              <div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
                <Heart size={28} className="text-[var(--color-gold)]/50" />
                <p className="text-sm text-[var(--color-ink-soft)]">
                  No saved sweets yet. Tap the heart on a product to save it.
                </p>
              </div>
            ) : (
              <ul className="flex flex-col gap-1.5">
                {saved.map((p) => (
                  <li
                    key={p.slug}
                    className="flex items-center gap-3 rounded-xl bg-[var(--color-ivory)]/60 p-2"
                  >
                    <Link href={`/product/${p.slug}`} onClick={onClose} className="shrink-0">
                      <Image
                        src={p.images[0]}
                        alt={p.name}
                        width={48}
                        height={48}
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/product/${p.slug}`}
                        onClick={onClose}
                        className="block truncate text-sm font-semibold text-[var(--color-ink)] hover:text-[var(--color-maroon)]"
                      >
                        {p.name}
                      </Link>
                      <p className="text-xs text-[var(--color-gold-deep)]">{formatINR(p.price)}</p>
                    </div>
                    <button
                      aria-label={`Add ${p.name} to cart`}
                      onClick={(e) => {
                        addItem(cartFields(p), 1, { x: e.clientX, y: e.clientY });
                        toast(`${p.name} added to cart`);
                      }}
                      className="grid h-8 w-8 place-items-center rounded-full bg-[var(--color-gold)] text-[var(--color-maroon-deep)] transition-transform hover:scale-110"
                    >
                      <Plus size={16} strokeWidth={3} />
                    </button>
                    <button
                      aria-label={`Remove ${p.name} from wishlist`}
                      onClick={() => toggle(p.slug)}
                      className="grid h-8 w-8 place-items-center rounded-full text-[var(--color-ink-soft)] hover:text-[var(--color-maroon)]"
                    >
                      <X size={15} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
