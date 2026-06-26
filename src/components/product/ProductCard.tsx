"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { TiltCard } from "@/components/ui/TiltCard";
import { Stars } from "@/components/ui/StarRating";
import { useWishlist } from "@/components/providers/WishlistProvider";
import { useCart } from "@/components/providers/CartProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { cartFields } from "@/lib/useProducts";
import { formatINR, cn } from "@/lib/utils";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  const { has, toggle } = useWishlist();
  const { addItem } = useCart();
  const { toast } = useToast();
  const wished = has(product.slug);
  const glow = product.accent === "pistachio" ? "#9fb86a" : "#f0b44a";

  return (
    <TiltCard intensity={7} className="group card-lux h-full overflow-hidden">
      <div className="relative aspect-square overflow-hidden rounded-t-[1.35rem] bg-gradient-to-b from-[var(--color-espresso)] to-[var(--color-maroon-deep)]">
        <div className="absolute inset-0 spotlight" />
        <div
          className="absolute left-1/2 top-1/2 h-1/2 w-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          style={{ background: glow, opacity: 0.5 }}
        />
        <Link href={`/product/${product.slug}`} className="absolute inset-0">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width:640px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </Link>
        <button
          onClick={() => {
            toggle(product.slug);
            toast(wished ? "Removed from wishlist" : `${product.name} saved`, "wish");
          }}
          aria-label="Toggle wishlist"
          className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-[var(--color-espresso)]/50 ring-1 ring-[var(--color-gold)]/40 backdrop-blur transition-transform hover:scale-110"
        >
          <Heart size={18} className={cn(wished ? "fill-[var(--color-gold-light)] text-[var(--color-gold-light)]" : "text-[var(--color-gold-light)]")} />
        </button>
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[var(--color-gold)]/60 to-transparent" />
      </div>

      <div className="flex flex-col p-6">
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-serif text-2xl font-bold text-[var(--color-maroon)] hover:text-[var(--color-maroon-soft)]">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 text-sm text-[var(--color-gold-deep)]">{product.tagline}</p>
        {product.ratingCount > 0 && (
          <div className="mt-2 flex items-center gap-2">
            <Stars value={product.ratingAvg} size={14} />
            <span className="text-xs text-[var(--color-ink-faint)]">({product.ratingCount})</span>
          </div>
        )}
        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-[var(--color-ink-soft)]">
          {product.shortDescription}
        </p>

        <div className="mt-5 flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <span className="font-serif text-2xl font-bold text-[var(--color-maroon)]">{formatINR(product.price)}</span>
            <span className="text-xs text-[var(--color-ink-faint)]">/ {product.weight}</span>
          </div>
          <button
            aria-label={`Add ${product.name} to cart`}
            onClick={(e) => {
              addItem(cartFields(product), 1, { x: e.clientX, y: e.clientY });
              toast(`${product.name} added to your box`);
            }}
            className="btn-gold !px-4 !py-2.5"
          >
            <ShoppingBag size={17} /> Add
          </button>
        </div>
      </div>
    </TiltCard>
  );
}
