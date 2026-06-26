import { prisma } from "@/lib/db";
import { getShippingSettings } from "@/lib/content";
import { ContentManager } from "@/components/admin/ContentManager";

export const dynamic = "force-dynamic";

export default async function AdminContentPage() {
  const [shipping, reviewRows] = await Promise.all([
    getShippingSettings(),
    prisma.review.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  const reviews = reviewRows.map((r) => ({
    id: r.id,
    productSlug: r.productSlug,
    customerName: r.customerName,
    rating: r.rating,
    comment: r.comment,
    approved: r.approved,
    createdAt: r.createdAt.toISOString(),
  }));

  return (
    <div>
      <header className="mb-8">
        <h1 className="font-display text-4xl font-semibold text-[var(--color-maroon)]">Content &amp; Settings</h1>
        <p className="mt-1 text-[var(--color-ink-soft)]">Shipping rules and customer review moderation.</p>
      </header>
      <ContentManager shipping={shipping} reviews={reviews} />
    </div>
  );
}
