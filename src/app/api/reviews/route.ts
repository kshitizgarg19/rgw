import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

const schema = z.object({
  customerName: z.string().min(2).max(60),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(3).max(800),
  productSlug: z.string().nullable().optional(),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const productSlug = searchParams.get("productSlug");
  const rows = await prisma.review.findMany({
    where: { approved: true, ...(productSlug ? { productSlug } : {}) },
    orderBy: { createdAt: "desc" },
    take: 30,
  });
  return NextResponse.json({
    reviews: rows.map((r) => ({
      id: r.id,
      productSlug: r.productSlug,
      customerName: r.customerName,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt.toISOString(),
    })),
  });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please fill in your name, rating, and a comment." }, { status: 400 });
  }
  const { customerName, rating, comment, productSlug } = parsed.data;

  // Link to a product if the slug exists.
  let productId: string | null = null;
  if (productSlug) {
    const product = await prisma.product.findUnique({ where: { slug: productSlug } });
    productId = product?.id ?? null;
  }

  const review = await prisma.review.create({
    data: { customerName, rating, comment, productSlug: productSlug ?? null, productId, approved: true },
  });

  // Recompute the product's rating aggregate.
  if (productSlug) {
    const agg = await prisma.review.aggregate({
      where: { productSlug, approved: true },
      _avg: { rating: true },
      _count: { rating: true },
    });
    await prisma.product.updateMany({
      where: { slug: productSlug },
      data: { ratingAvg: agg._avg.rating ?? 0, ratingCount: agg._count.rating ?? 0 },
    });
  }

  return NextResponse.json({
    review: {
      id: review.id,
      productSlug: review.productSlug,
      customerName: review.customerName,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt.toISOString(),
    },
  });
}
