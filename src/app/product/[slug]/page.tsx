import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { getProductBySlug, getProducts } from "@/lib/catalog";
import { getRecentReviews, getReviewStats } from "@/lib/reviews";
import { ProductDetail } from "@/components/product/ProductDetail";
import { ProductCard } from "@/components/product/ProductCard";
import { Reviews } from "@/components/home/Reviews";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductJsonLd, BreadcrumbJsonLd } from "@/components/seo/StructuredData";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: `${product.name} (${product.weight}) — ₹${product.price}`,
    description: product.shortDescription,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      title: `${product.name} — RGW Sweets`,
      description: product.shortDescription,
      images: [product.images[0]],
      type: "website",
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [allProducts, reviews, stats] = await Promise.all([
    getProducts(),
    getRecentReviews({ productSlug: slug, limit: 6 }),
    getReviewStats(slug),
  ]);
  const related = allProducts.filter((p) => p.slug !== slug);

  return (
    <>
      <ProductJsonLd product={product} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Shop", url: "/shop" },
          { name: product.name, url: `/product/${product.slug}` },
        ]}
      />

      <div className="mx-auto max-w-6xl px-6 pb-12 pt-28">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-1.5 text-sm text-[var(--color-ink-faint)]">
          <Link href="/" className="hover:text-[var(--color-maroon)]">Home</Link>
          <ChevronRight size={14} />
          <Link href="/shop" className="hover:text-[var(--color-maroon)]">Shop</Link>
          <ChevronRight size={14} />
          <span className="text-[var(--color-maroon)]">{product.name}</span>
        </nav>

        <ProductDetail product={product} />
      </div>

      {/* Reviews */}
      <Reviews
        initialReviews={reviews}
        avg={stats.avg}
        count={stats.count}
        productSlug={product.slug}
        eyebrow="Reviews"
        title={`What people say about ${product.name}`}
        subtitle="Honest words from customers who ordered this sweet."
      />

      {/* Related */}
      {related.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-16">
          <SectionHeading eyebrow="Don't miss" title="You may also love" />
          <div className="mx-auto mt-12 grid max-w-3xl gap-6 sm:grid-cols-2">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
