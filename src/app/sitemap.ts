import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";
import { getProducts } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE.url;
  const now = new Date();

  const staticRoutes = [
    "",
    "/shop",
    "/about",
    "/contact",
    "/shipping-policy",
    "/refund-policy",
    "/privacy-policy",
    "/terms",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const products = await getProducts();
    productRoutes = products.map((p) => ({
      url: `${base}/product/${p.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    }));
  } catch {
    /* DB unavailable at build — static routes are enough */
  }

  return [...staticRoutes, ...productRoutes];
}
