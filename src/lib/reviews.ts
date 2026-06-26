import "server-only";
import { prisma } from "@/lib/db";
import type { ReviewItem } from "@/lib/types";

export async function getRecentReviews(
  opts: { limit?: number; productSlug?: string | null } = {}
): Promise<ReviewItem[]> {
  const rows = await prisma.review.findMany({
    where: {
      approved: true,
      ...(opts.productSlug ? { productSlug: opts.productSlug } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: opts.limit ?? 8,
  });
  return rows.map((r) => ({
    id: r.id,
    productSlug: r.productSlug,
    customerName: r.customerName,
    rating: r.rating,
    comment: r.comment,
    createdAt: r.createdAt.toISOString(),
  }));
}

export async function getReviewStats(productSlug?: string | null) {
  const agg = await prisma.review.aggregate({
    where: {
      approved: true,
      ...(productSlug ? { productSlug } : {}),
    },
    _avg: { rating: true },
    _count: { rating: true },
  });
  return { avg: agg._avg.rating ?? 5, count: agg._count.rating ?? 0 };
}
