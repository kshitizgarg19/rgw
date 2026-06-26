"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin, requireSuperAdmin } from "@/lib/auth";
import { setContent } from "@/lib/content";
import { ORDER_STATUSES } from "@/lib/constants";
import { slugify } from "@/lib/utils";

type Result = { ok: boolean; error?: string };

function revalidateStore() {
  revalidatePath("/");
  revalidatePath("/shop");
}

/* ── Orders ─────────────────────────────────────────────────────────────── */
export async function updateOrderStatus(orderId: string, status: string): Promise<Result> {
  await requireAdmin();
  if (!(ORDER_STATUSES as readonly string[]).includes(status)) {
    return { ok: false, error: "Invalid status." };
  }
  await prisma.order.update({ where: { id: orderId }, data: { orderStatus: status } });
  revalidatePath("/rgw-admin/orders");
  revalidatePath("/rgw-admin");
  return { ok: true };
}

export async function updatePaymentStatus(orderId: string, status: string): Promise<Result> {
  await requireAdmin();
  if (!["PENDING", "PAID", "FAILED"].includes(status)) return { ok: false, error: "Invalid payment status." };
  await prisma.order.update({ where: { id: orderId }, data: { paymentStatus: status } });
  revalidatePath("/rgw-admin/orders");
  return { ok: true };
}

/* ── Products ───────────────────────────────────────────────────────────── */
const productSchema = z.object({
  id: z.string().optional(),
  slug: z.string().optional(),
  name: z.string().min(2),
  tagline: z.string().min(2),
  price: z.coerce.number().int().min(0),
  weight: z.string().min(1),
  accent: z.enum(["mawa", "pistachio"]),
  shortDescription: z.string().min(2),
  description: z.string().min(2),
  story: z.string().min(2),
  ingredients: z.array(z.string()),
  notes: z.array(z.string()),
  images: z.array(z.string()).min(1),
  stock: z.coerce.number().int().min(0),
  sortOrder: z.coerce.number().int().default(0),
});

export async function upsertProduct(input: z.input<typeof productSchema>): Promise<Result> {
  await requireSuperAdmin();
  const parsed = productSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Please complete all product fields." };
  const d = parsed.data;

  const data = {
    name: d.name,
    tagline: d.tagline,
    price: d.price,
    weight: d.weight,
    accent: d.accent,
    shortDescription: d.shortDescription,
    description: d.description,
    story: d.story,
    ingredients: JSON.stringify(d.ingredients),
    notes: JSON.stringify(d.notes),
    images: JSON.stringify(d.images),
    stock: d.stock,
    sortOrder: d.sortOrder,
  };

  if (d.id) {
    await prisma.product.update({ where: { id: d.id }, data });
  } else {
    const slug = d.slug ? slugify(d.slug) : slugify(d.name);
    await prisma.product.create({ data: { ...data, slug, active: true } });
  }
  revalidatePath("/rgw-admin/products");
  revalidateStore();
  return { ok: true };
}

export async function toggleProduct(id: string, active: boolean): Promise<Result> {
  await requireAdmin();
  await prisma.product.update({ where: { id }, data: { active } });
  revalidatePath("/rgw-admin/products");
  revalidateStore();
  return { ok: true };
}

export async function deleteProduct(id: string): Promise<Result> {
  await requireSuperAdmin();
  await prisma.product.delete({ where: { id } });
  revalidatePath("/rgw-admin/products");
  revalidateStore();
  return { ok: true };
}

/* ── Coupons ────────────────────────────────────────────────────────────── */
const couponSchema = z.object({
  code: z.string().min(2).max(40),
  type: z.enum(["PERCENT", "FIXED"]),
  value: z.coerce.number().int().min(1),
  minOrder: z.coerce.number().int().min(0).default(0),
  expiresAt: z.string().optional(),
});

export async function createCoupon(input: z.input<typeof couponSchema>): Promise<Result> {
  await requireSuperAdmin();
  const parsed = couponSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Please complete the coupon fields." };
  const d = parsed.data;
  try {
    await prisma.coupon.create({
      data: {
        code: d.code.trim().toUpperCase(),
        type: d.type,
        value: d.value,
        minOrder: d.minOrder,
        expiresAt: d.expiresAt ? new Date(d.expiresAt) : null,
        active: true,
      },
    });
  } catch {
    return { ok: false, error: "A coupon with that code already exists." };
  }
  revalidatePath("/rgw-admin/coupons");
  return { ok: true };
}

export async function toggleCoupon(id: string, active: boolean): Promise<Result> {
  await requireAdmin();
  await prisma.coupon.update({ where: { id }, data: { active } });
  revalidatePath("/rgw-admin/coupons");
  return { ok: true };
}

export async function deleteCoupon(id: string): Promise<Result> {
  await requireSuperAdmin();
  await prisma.coupon.delete({ where: { id } });
  revalidatePath("/rgw-admin/coupons");
  return { ok: true };
}

/* ── Content ────────────────────────────────────────────────────────────── */
export async function updateShipping(input: { charge: number; freeAbove: number; etaText: string }): Promise<Result> {
  await requireAdmin();
  await setContent("shipping", {
    charge: Number(input.charge) || 0,
    freeAbove: Number(input.freeAbove) || 0,
    etaText: input.etaText || "",
  });
  revalidateStore();
  revalidatePath("/cart");
  revalidatePath("/checkout");
  revalidatePath("/rgw-admin/content");
  return { ok: true };
}

export async function updateContentBlob(key: string, value: string): Promise<Result> {
  await requireAdmin();
  await setContent(key, value);
  revalidateStore();
  revalidatePath("/rgw-admin/content");
  return { ok: true };
}

/* ── Reviews ────────────────────────────────────────────────────────────── */
export async function moderateReview(id: string, action: "approve" | "hide" | "delete"): Promise<Result> {
  await requireAdmin();
  const review = await prisma.review.findUnique({ where: { id } });
  if (!review) return { ok: false, error: "Review not found." };

  if (action === "delete") {
    await prisma.review.delete({ where: { id } });
  } else {
    await prisma.review.update({ where: { id }, data: { approved: action === "approve" } });
  }

  // Recompute the product rating if linked.
  if (review.productSlug) {
    const agg = await prisma.review.aggregate({
      where: { productSlug: review.productSlug, approved: true },
      _avg: { rating: true },
      _count: { rating: true },
    });
    await prisma.product.updateMany({
      where: { slug: review.productSlug },
      data: { ratingAvg: agg._avg.rating ?? 0, ratingCount: agg._count.rating ?? 0 },
    });
  }
  revalidatePath("/rgw-admin/content");
  revalidateStore();
  return { ok: true };
}
