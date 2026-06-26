import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { couponDiscount } from "@/lib/pricing";
import { formatINR } from "@/lib/utils";

export const dynamic = "force-dynamic";

const schema = z.object({
  code: z.string().min(1).max(40),
  subtotal: z.number().nonnegative(),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ valid: false, error: "Invalid request." }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ valid: false, error: "Enter a coupon code." }, { status: 400 });
  }

  const code = parsed.data.code.trim().toUpperCase();
  const subtotal = parsed.data.subtotal;
  const coupon = await prisma.coupon.findUnique({ where: { code } });

  if (!coupon || !coupon.active) {
    return NextResponse.json({ valid: false, error: "This coupon code is not valid." });
  }
  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    return NextResponse.json({ valid: false, error: "This coupon has expired." });
  }
  if (subtotal < coupon.minOrder) {
    return NextResponse.json({
      valid: false,
      error: `Spend ${formatINR(coupon.minOrder)} or more to use this coupon.`,
    });
  }

  return NextResponse.json({
    valid: true,
    coupon: {
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      minOrder: coupon.minOrder,
      discount: couponDiscount(coupon, subtotal),
    },
  });
}
