"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { TiltCard } from "@/components/ui/TiltCard";
import { Stars } from "@/components/ui/StarRating";
import { AddToCartButton, BuyNowButton } from "@/components/product/AddToCart";
import { useWishlist } from "@/components/providers/WishlistProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { Reveal } from "@/components/ui/Reveal";
import { formatINR, cn } from "@/lib/utils";
import type { Product } from "@/lib/types";

export function ProductShowcase({ product, index }: { product: Product; index: number }) {
  const { has, toggle } = useWishlist();
  const { toast } = useToast();
  const wished = has(product.slug);
  const reverse = index % 2 === 1;
  const glow = product.accent === "pistachio" ? "#9fb86a" : "#f0b44a";

  return (
    <Reveal delay={index * 0.08}>
      <TiltCard intensity={6} className="group card-lux overflow-hidden">
        <div className={cn("grid items-center gap-2 md:grid-cols-2")}>
          {/* Image */}
          <div className={cn("relative aspect-square overflow-hidden bg-gradient-to-br from-[var(--color-espresso)] to-[var(--color-maroon-deep)]", reverse && "md:order-2")}>
            <div className="absolute inset-0 spotlight" />
            <div
              className="absolute left-1/2 top-1/2 h-3/5 w-3/5 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
              style={{ background: glow, opacity: 0.5 }}
            />
            <Link href={`/product/${product.slug}`} className="absolute inset-0">
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                sizes="(max-width:768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </Link>
            <button
              onClick={() => {
                toggle(product.slug);
                toast(wished ? "Removed from wishlist" : `${product.name} saved to wishlist`, "wish");
              }}
              aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
              className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-[var(--color-espresso)]/50 ring-1 ring-[var(--color-gold)]/40 backdrop-blur transition-transform hover:scale-110"
            >
              <Heart
                size={20}
                className={cn(wished ? "fill-[var(--color-gold-light)] text-[var(--color-gold-light)]" : "text-[var(--color-gold-light)]")}
              />
            </button>
          </div>

          {/* Details */}
          <div className={cn("flex flex-col p-8 md:p-10", reverse && "md:order-1")}>
            <span className="eyebrow">{product.weight} · Signature</span>
            <h3 className="mt-2 font-serif text-3xl font-bold text-[var(--color-maroon)] sm:text-4xl">
              {product.name}
            </h3>
            <p className="mt-1 text-[var(--color-gold-deep)]">{product.tagline}</p>

            {product.ratingCount > 0 && (
              <div className="mt-3 flex items-center gap-2">
                <Stars value={product.ratingAvg} />
                <span className="text-sm text-[var(--color-ink-soft)]">
                  {product.ratingAvg.toFixed(1)} ({product.ratingCount})
                </span>
              </div>
            )}

            <p className="mt-4 leading-relaxed text-[var(--color-ink-soft)]">
              {product.shortDescription}
            </p>

            <div className="mt-6 flex items-baseline gap-2">
              <span className="font-serif text-3xl font-bold text-[var(--color-maroon)]">
                {formatINR(product.price)}
              </span>
              <span className="text-sm text-[var(--color-ink-faint)]">/ {product.weight}</span>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <AddToCartButton product={product} />
              <BuyNowButton product={product} />
            </div>

            <Link
              href={`/product/${product.slug}`}
              className="mt-5 inline-flex w-fit items-center gap-1 text-sm font-semibold text-[var(--color-maroon)] underline-offset-4 hover:underline"
            >
              Discover the story →
            </Link>
          </div>
        </div>
      </TiltCard>
    </Reveal>
  );
}
