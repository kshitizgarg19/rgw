"use client";

import { useState } from "react";
import { Check, Heart, Leaf, ShieldCheck, Truck } from "lucide-react";
import { Product3DViewer } from "./Product3DViewer";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { AddToCartButton, BuyNowButton } from "./AddToCart";
import { Stars } from "@/components/ui/StarRating";
import { useWishlist } from "@/components/providers/WishlistProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { formatINR, cn } from "@/lib/utils";
import { DELIVERY } from "@/lib/constants";
import type { Product } from "@/lib/types";

export function ProductDetail({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const { has, toggle } = useWishlist();
  const { toast } = useToast();
  const wished = has(product.slug);

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
      {/* Viewer */}
      <div className="lg:sticky lg:top-28 lg:self-start">
        <Product3DViewer images={product.images} name={product.name} accent={product.accent} />
      </div>

      {/* Info */}
      <div>
        <span className="eyebrow">{product.weight} · Signature Mithai</span>
        <div className="mt-2 flex items-start justify-between gap-4">
          <h1 className="font-serif text-4xl font-bold leading-tight text-[var(--color-maroon)] sm:text-5xl">
            {product.name}
          </h1>
          <button
            onClick={() => {
              toggle(product.slug);
              toast(wished ? "Removed from wishlist" : `${product.name} saved to wishlist`, "wish");
            }}
            aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
            className="mt-1 grid h-12 w-12 shrink-0 place-items-center rounded-full border border-[var(--color-gold)]/40 transition-transform hover:scale-110"
          >
            <Heart size={22} className={cn(wished ? "fill-[var(--color-maroon)] text-[var(--color-maroon)]" : "text-[var(--color-maroon)]")} />
          </button>
        </div>
        <p className="mt-1 text-lg text-[var(--color-gold-deep)]">{product.tagline}</p>

        {product.ratingCount > 0 && (
          <div className="mt-3 flex items-center gap-2">
            <Stars value={product.ratingAvg} size={18} />
            <span className="text-sm text-[var(--color-ink-soft)]">
              {product.ratingAvg.toFixed(1)} · {product.ratingCount} reviews
            </span>
          </div>
        )}

        <div className="mt-5 flex items-baseline gap-2">
          <span className="font-serif text-4xl font-bold text-[var(--color-maroon)]">{formatINR(product.price)}</span>
          <span className="text-[var(--color-ink-faint)]">per {product.weight}</span>
        </div>

        <p className="mt-5 leading-relaxed text-[var(--color-ink-soft)]">{product.description}</p>

        {/* Quantity + actions */}
        <div className="mt-7 flex flex-wrap items-center gap-4">
          <QuantityStepper value={qty} onChange={setQty} />
          <span className="text-sm text-[var(--color-ink-faint)]">
            {formatINR(product.price * qty)} total
          </span>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <AddToCartButton product={product} quantity={qty} />
          <BuyNowButton product={product} quantity={qty} />
        </div>

        {/* Trust strip */}
        <div className="mt-7 grid grid-cols-3 gap-3 border-t border-[var(--color-gold)]/20 pt-6">
          <Trust icon={Leaf} label="No preservatives" />
          <Trust icon={ShieldCheck} label="Hygienically packed" />
          <Trust icon={Truck} label={`Fresh to ${"Delhi NCR"}`} />
        </div>
        <p className="mt-3 text-xs text-[var(--color-ink-faint)]">{DELIVERY.etaText}</p>

        {/* Ingredients */}
        <div className="mt-9">
          <h2 className="font-serif text-2xl font-bold text-[var(--color-maroon)]">What goes in</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {product.ingredients.map((ing) => (
              <span
                key={ing}
                className="rounded-full border border-[var(--color-gold)]/30 bg-[var(--color-ivory)] px-4 py-2 text-sm text-[var(--color-ink-soft)]"
              >
                {ing}
              </span>
            ))}
          </div>
        </div>

        {/* Notes */}
        <ul className="mt-7 flex flex-col gap-2.5">
          {product.notes.map((note) => (
            <li key={note} className="flex items-center gap-3 text-[var(--color-ink-soft)]">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[var(--color-pistachio)]/20 text-[var(--color-pistachio-deep)]">
                <Check size={14} strokeWidth={3} />
              </span>
              {note}
            </li>
          ))}
        </ul>

        {/* Story */}
        <div className="mt-9 rounded-2xl bg-gradient-to-br from-[var(--color-maroon)] to-[var(--color-maroon-deep)] p-7 text-[var(--color-cream)]">
          <h2 className="font-serif text-2xl font-bold text-[var(--color-gold-light)]">The story behind it</h2>
          <p className="mt-3 leading-relaxed text-[var(--color-cream)]/85">{product.story}</p>
        </div>
      </div>
    </div>
  );
}

function Trust({ icon: Icon, label }: { icon: React.ComponentType<{ size?: number }>; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <span className="grid h-10 w-10 place-items-center rounded-full bg-[var(--color-gold)]/15 text-[var(--color-gold-deep)]">
        <Icon size={18} />
      </span>
      <span className="text-xs leading-tight text-[var(--color-ink-soft)]">{label}</span>
    </div>
  );
}
