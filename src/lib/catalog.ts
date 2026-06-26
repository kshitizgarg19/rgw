import "server-only";
import { cache } from "react";
import { prisma } from "@/lib/db";
import type { Product } from "@/lib/types";
import type { Product as DbProduct } from "@prisma/client";

function safeParse(json: string, fallback: string[] = []): string[] {
  try {
    const v = JSON.parse(json);
    return Array.isArray(v) ? v : fallback;
  } catch {
    return fallback;
  }
}

export function mapProduct(row: DbProduct): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    tagline: row.tagline,
    price: row.price,
    weight: row.weight,
    accent: (row.accent === "pistachio" ? "pistachio" : "mawa"),
    shortDescription: row.shortDescription,
    description: row.description,
    story: row.story,
    ingredients: safeParse(row.ingredients),
    notes: safeParse(row.notes),
    images: safeParse(row.images, ["/products/mawa-barfi.svg"]),
    ratingAvg: row.ratingAvg,
    ratingCount: row.ratingCount,
    stock: row.stock,
    active: row.active,
    sortOrder: row.sortOrder,
  };
}

/** All products (active only by default), cached per request. */
export const getProducts = cache(
  async (opts: { includeInactive?: boolean } = {}): Promise<Product[]> => {
    const rows = await prisma.product.findMany({
      where: opts.includeInactive ? undefined : { active: true },
      orderBy: { sortOrder: "asc" },
    });
    return rows.map(mapProduct);
  }
);

export const getProductBySlug = cache(
  async (slug: string): Promise<Product | null> => {
    const row = await prisma.product.findUnique({ where: { slug } });
    return row ? mapProduct(row) : null;
  }
);
