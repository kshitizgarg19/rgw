"use client";

import { useEffect, useState } from "react";
import type { Product } from "./types";

// Module-level cache so the nav search / wishlist menu fetch products once.
let cache: Product[] | null = null;
let inflight: Promise<Product[]> | null = null;

async function load(): Promise<Product[]> {
  if (cache) return cache;
  if (!inflight) {
    inflight = fetch("/api/products")
      .then((r) => (r.ok ? r.json() : { products: [] }))
      .then((d) => {
        cache = (d.products ?? d ?? []) as Product[];
        return cache;
      })
      .catch(() => [] as Product[]);
  }
  return inflight;
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(cache ?? []);
  useEffect(() => {
    let mounted = true;
    load().then((p) => mounted && setProducts(p));
    return () => {
      mounted = false;
    };
  }, []);
  return products;
}

export function cartFields(p: Product) {
  return {
    slug: p.slug,
    name: p.name,
    price: p.price,
    weight: p.weight,
    image: p.images[0] ?? "/products/mawa-barfi.svg",
    accent: p.accent,
  };
}
