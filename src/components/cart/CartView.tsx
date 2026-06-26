"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShoppingBag, Tag, Trash2, X } from "lucide-react";
import { useCart } from "@/components/providers/CartProvider";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { computeDelivery } from "@/lib/pricing";
import { formatINR } from "@/lib/utils";
import type { ShippingSettings } from "@/lib/content";

export function CartView({ shipping }: { shipping: ShippingSettings }) {
  const {
    items,
    subtotal,
    discount,
    coupon,
    couponError,
    applyCoupon,
    removeCoupon,
    setQty,
    removeItem,
    hydrated,
  } = useCart();
  const [code, setCode] = useState("");
  const [applying, setApplying] = useState(false);

  const delivery = computeDelivery(subtotal, shipping);
  const total = Math.max(0, subtotal - discount + delivery);

  if (!hydrated) {
    return <p className="py-20 text-center text-[var(--color-ink-soft)]">Loading your box…</p>;
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-5 py-20 text-center">
        <div className="grid h-24 w-24 place-items-center rounded-full bg-[var(--color-gold)]/12">
          <ShoppingBag size={40} className="text-[var(--color-gold-deep)]" />
        </div>
        <h2 className="font-serif text-3xl font-bold text-[var(--color-maroon)]">Your box is empty</h2>
        <p className="max-w-sm text-[var(--color-ink-soft)]">
          Looks like you haven&apos;t added any sweetness yet. Our two signature barfis are waiting.
        </p>
        <Link href="/shop" className="btn-gold mt-2">Browse Sweets</Link>
      </div>
    );
  }

  async function onApply() {
    if (!code.trim()) return;
    setApplying(true);
    await applyCoupon(code.trim());
    setApplying(false);
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
      {/* Items */}
      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <div key={item.slug} className="card-lux flex gap-4 p-4">
            <Link href={`/product/${item.slug}`} className="shrink-0">
              <Image
                src={item.image}
                alt={item.name}
                width={110}
                height={110}
                className="h-24 w-24 rounded-xl object-cover ring-1 ring-[var(--color-gold)]/20 sm:h-28 sm:w-28"
              />
            </Link>
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Link href={`/product/${item.slug}`}>
                    <h3 className="font-serif text-xl font-bold text-[var(--color-maroon)]">{item.name}</h3>
                  </Link>
                  <p className="text-sm text-[var(--color-ink-soft)]">{item.weight}</p>
                  <p className="mt-1 text-sm text-[var(--color-gold-deep)]">{formatINR(item.price)} each</p>
                </div>
                <button
                  onClick={() => removeItem(item.slug)}
                  aria-label={`Remove ${item.name}`}
                  className="text-[var(--color-ink-faint)] transition-colors hover:text-[var(--color-maroon)]"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              <div className="mt-auto flex items-center justify-between pt-3">
                <QuantityStepper value={item.quantity} onChange={(v) => setQty(item.slug, v)} size="sm" />
                <span className="font-serif text-lg font-bold text-[var(--color-maroon)]">
                  {formatINR(item.price * item.quantity)}
                </span>
              </div>
            </div>
          </div>
        ))}
        <Link href="/shop" className="mt-1 inline-flex w-fit items-center gap-1 text-sm font-semibold text-[var(--color-maroon)] hover:underline">
          ← Continue shopping
        </Link>
      </div>

      {/* Summary */}
      <div className="lg:sticky lg:top-28 lg:self-start">
        <div className="card-lux p-6">
          <h2 className="font-serif text-2xl font-bold text-[var(--color-maroon)]">Order Summary</h2>

          {/* Coupon */}
          <div className="mt-5">
            {coupon ? (
              <div className="flex items-center justify-between rounded-xl bg-[var(--color-pistachio)]/15 px-4 py-3">
                <span className="flex items-center gap-2 text-sm font-semibold text-[var(--color-pistachio-deep)]">
                  <Tag size={16} /> {coupon.code} applied
                </span>
                <button onClick={removeCoupon} aria-label="Remove coupon" className="text-[var(--color-ink-soft)] hover:text-[var(--color-maroon)]">
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="Coupon code"
                  className="flex-1 rounded-xl border border-[var(--color-gold)]/30 bg-[var(--color-ivory)] px-4 py-2.5 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-gold)]"
                />
                <button onClick={onApply} disabled={applying} className="btn-outline !px-5 !py-2.5 text-sm disabled:opacity-60">
                  {applying ? "…" : "Apply"}
                </button>
              </div>
            )}
            {couponError && <p className="mt-2 text-xs text-[var(--color-maroon-soft)]">{couponError}</p>}
            {!coupon && (
              <p className="mt-2 text-xs text-[var(--color-ink-faint)]">Try WELCOME10 for 10% off.</p>
            )}
          </div>

          {/* Totals */}
          <div className="mt-5 flex flex-col gap-2.5 border-t border-[var(--color-gold)]/20 pt-5 text-sm">
            <Row label="Subtotal" value={formatINR(subtotal)} />
            {discount > 0 && <Row label="Discount" value={`− ${formatINR(discount)}`} accent />}
            <Row
              label="Delivery"
              value={delivery === 0 ? "FREE" : formatINR(delivery)}
              accent={delivery === 0}
            />
            {delivery > 0 && (
              <p className="text-xs text-[var(--color-ink-faint)]">
                Free delivery on orders over {formatINR(shipping.freeAbove)}.
              </p>
            )}
            <div className="mt-2 flex items-center justify-between border-t border-[var(--color-gold)]/20 pt-3">
              <span className="font-serif text-lg font-bold text-[var(--color-maroon)]">Total</span>
              <span className="font-serif text-2xl font-bold text-[var(--color-maroon)]">{formatINR(total)}</span>
            </div>
          </div>

          <Link href="/checkout" className="btn-gold mt-6 w-full justify-center">
            Proceed to Checkout <ArrowRight size={18} />
          </Link>
          <p className="mt-3 text-center text-xs text-[var(--color-ink-faint)]">{shipping.etaText}</p>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[var(--color-ink-soft)]">{label}</span>
      <span className={accent ? "font-semibold text-[var(--color-pistachio-deep)]" : "font-medium text-[var(--color-ink)]"}>
        {value}
      </span>
    </div>
  );
}
