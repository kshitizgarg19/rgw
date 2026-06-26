"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";
import type { Product } from "@/lib/types";

export function ShopGrid({ products }: { products: Product[] }) {
  const [q, setQ] = useState("");

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
    <div>
      <div className="mx-auto mb-10 flex max-w-md items-center gap-3 rounded-full border border-[var(--color-gold)]/30 bg-[var(--color-ivory)] px-5 py-3 shadow-soft">
        <Search size={20} className="text-[var(--color-gold-deep)]" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search Mawa, Ghiya, pistachio…"
          className="flex-1 bg-transparent text-[var(--color-ink)] placeholder:text-[var(--color-ink-faint)] focus:outline-none"
        />
      </div>

      {results.length === 0 ? (
        <p className="py-16 text-center text-[var(--color-ink-soft)]">
          No sweets match “{q}”. Try another search.
        </p>
      ) : (
        <Stagger className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2" amount={0.1}>
          {results.map((p) => (
            <StaggerItem key={p.slug} className="h-full">
              <ProductCard product={p} />
            </StaggerItem>
          ))}
        </Stagger>
      )}
    </div>
  );
}
