"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "@/components/providers/CartProvider";
import { formatINR } from "@/lib/utils";

export function CartDrawer() {
  const { isOpen, closeCart, items, subtotal, discount, setQty, removeItem, count } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[150] bg-[var(--color-maroon-deep)]/45 backdrop-blur-sm"
            onClick={closeCart}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 320 }}
            className="fixed inset-y-0 right-0 z-[160] flex w-[min(92vw,420px)] flex-col bg-[var(--color-cream)] shadow-[-20px_0_60px_rgba(58,13,22,0.25)]"
            role="dialog"
            aria-label="Shopping cart"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[var(--color-gold)]/20 px-5 py-4">
              <div className="flex items-center gap-2">
                <ShoppingBag size={20} className="text-[var(--color-maroon)]" />
                <h2 className="font-serif text-xl font-bold text-[var(--color-maroon)]">
                  Your Box{count > 0 && <span className="text-[var(--color-gold-deep)]"> · {count}</span>}
                </h2>
              </div>
              <button onClick={closeCart} aria-label="Close cart" className="grid h-9 w-9 place-items-center rounded-full text-[var(--color-ink-soft)] hover:bg-[var(--color-gold)]/15">
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
                <div className="grid h-20 w-20 place-items-center rounded-full bg-[var(--color-gold)]/12">
                  <ShoppingBag size={34} className="text-[var(--color-gold-deep)]" />
                </div>
                <p className="font-serif text-xl text-[var(--color-maroon)]">Your box is empty</p>
                <p className="text-sm text-[var(--color-ink-soft)]">
                  Add a little sweetness — freshly made, just for you.
                </p>
                <Link href="/shop" onClick={closeCart} className="btn-gold mt-2">
                  Browse Sweets
                </Link>
              </div>
            ) : (
              <>
                <ul className="flex-1 overflow-y-auto px-4 py-3">
                  {items.map((item) => (
                    <li key={item.slug} className="flex gap-3 border-b border-[var(--color-gold)]/15 py-4 last:border-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={72}
                        height={72}
                        className="h-18 w-18 shrink-0 rounded-xl object-cover ring-1 ring-[var(--color-gold)]/20"
                      />
                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-serif text-base font-bold leading-tight text-[var(--color-maroon)]">
                              {item.name}
                            </p>
                            <p className="text-xs text-[var(--color-ink-soft)]">{item.weight}</p>
                          </div>
                          <button
                            onClick={() => removeItem(item.slug)}
                            aria-label={`Remove ${item.name}`}
                            className="text-[var(--color-ink-faint)] transition-colors hover:text-[var(--color-maroon)]"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div className="mt-auto flex items-center justify-between pt-2">
                          <div className="flex items-center gap-1 rounded-full border border-[var(--color-gold)]/35 bg-[var(--color-ivory)] p-0.5">
                            <Stepper aria-label="Decrease" onClick={() => setQty(item.slug, item.quantity - 1)}>
                              <Minus size={14} />
                            </Stepper>
                            <span className="w-6 text-center text-sm font-semibold text-[var(--color-ink)]">
                              {item.quantity}
                            </span>
                            <Stepper aria-label="Increase" onClick={() => setQty(item.slug, item.quantity + 1)}>
                              <Plus size={14} />
                            </Stepper>
                          </div>
                          <span className="font-semibold text-[var(--color-ink)]">
                            {formatINR(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                {/* Footer */}
                <div className="border-t border-[var(--color-gold)]/20 bg-[var(--color-ivory)]/60 px-5 py-4">
                  <div className="mb-1 flex items-center justify-between text-sm text-[var(--color-ink-soft)]">
                    <span>Subtotal</span>
                    <span className="font-medium text-[var(--color-ink)]">{formatINR(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="mb-1 flex items-center justify-between text-sm text-[var(--color-pistachio-deep)]">
                      <span>Coupon discount</span>
                      <span>−{formatINR(discount)}</span>
                    </div>
                  )}
                  <p className="mb-3 text-xs text-[var(--color-ink-faint)]">
                    Delivery calculated at checkout.
                  </p>
                  <div className="flex gap-2">
                    <Link href="/cart" onClick={closeCart} className="btn-outline flex-1 justify-center py-3">
                      View Cart
                    </Link>
                    <Link href="/checkout" onClick={closeCart} className="btn-gold flex-1 justify-center py-3">
                      Checkout
                    </Link>
                  </div>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function Stepper({ children, onClick, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      onClick={onClick}
      className="grid h-7 w-7 place-items-center rounded-full text-[var(--color-maroon)] transition-colors hover:bg-[var(--color-gold)]/20"
      {...props}
    >
      {children}
    </button>
  );
}
