import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getShippingSettings } from "@/lib/content";
import { computeDelivery, couponDiscount } from "@/lib/pricing";
import { generateOrderNumber } from "@/lib/utils";
import { sendConfirmationEmail, sendWhatsAppConfirmation } from "@/lib/notifications";
import { initiatePayment } from "@/lib/payment/phonepe";

export const dynamic = "force-dynamic";

const schema = z.object({
  customer: z.object({
    fullName: z.string().min(2).max(80),
    mobile: z.string().min(7).max(15),
    email: z.union([z.string().email(), z.literal("")]).optional(),
    houseNumber: z.string().min(1).max(60),
    street: z.string().min(2).max(160),
    landmark: z.union([z.string().max(120), z.literal("")]).optional(),
    city: z.string().min(2).max(80),
    state: z.string().min(2).max(80),
    pincode: z.string().min(4).max(10),
  }),
  items: z
    .array(z.object({ slug: z.string(), quantity: z.number().int().min(1).max(99) }))
    .min(1),
  couponCode: z.string().nullable().optional(),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please complete all required delivery fields." },
      { status: 400 }
    );
  }
  const { customer: c, items, couponCode } = parsed.data;
  const email = c.email || null;
  const landmark = c.landmark || null;

  // Price everything server-side from the DB — never trust client totals.
  const products = await prisma.product.findMany({
    where: { slug: { in: items.map((i) => i.slug) }, active: true },
  });
  const bySlug = new Map(products.map((p) => [p.slug, p]));

  let subtotal = 0;
  const orderItems = items
    .map((it) => {
      const p = bySlug.get(it.slug);
      if (!p) return null;
      const lineTotal = p.price * it.quantity;
      subtotal += lineTotal;
      return {
        productId: p.id,
        productSlug: p.slug,
        name: p.name,
        price: p.price,
        quantity: it.quantity,
        lineTotal,
      };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  if (orderItems.length === 0) {
    return NextResponse.json({ error: "Your cart is empty or items are unavailable." }, { status: 400 });
  }

  const shipping = await getShippingSettings();
  const deliveryCharge = computeDelivery(subtotal, shipping);

  // Coupon (re-validated server-side).
  let discount = 0;
  let appliedCode: string | null = null;
  let couponId: string | null = null;
  if (couponCode) {
    const code = couponCode.trim().toUpperCase();
    const coupon = await prisma.coupon.findUnique({ where: { code } });
    if (
      coupon &&
      coupon.active &&
      (!coupon.expiresAt || coupon.expiresAt >= new Date()) &&
      subtotal >= coupon.minOrder
    ) {
      discount = couponDiscount(coupon, subtotal);
      appliedCode = code;
      couponId = coupon.id;
    }
  }

  const total = Math.max(0, subtotal - discount + deliveryCharge);

  // Upsert the customer by phone.
  const customer = await prisma.customer.upsert({
    where: { phone: c.mobile },
    update: { name: c.fullName, email },
    create: { name: c.fullName, phone: c.mobile, email },
  });

  // Create the order (retry once if order number collides).
  let order;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      order = await prisma.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          customerId: customer.id,
          fullName: c.fullName,
          mobile: c.mobile,
          email,
          houseNumber: c.houseNumber,
          street: c.street,
          landmark,
          city: c.city,
          state: c.state,
          pincode: c.pincode,
          subtotal,
          deliveryCharge,
          discount,
          total,
          couponCode: appliedCode,
          paymentStatus: "PENDING",
          orderStatus: "NEW",
          items: { create: orderItems },
        },
      });
      break;
    } catch (e: unknown) {
      const code = (e as { code?: string })?.code;
      if (code === "P2002" && attempt < 2) continue; // duplicate orderNumber
      throw e;
    }
  }
  if (!order) {
    return NextResponse.json({ error: "Could not create order. Please try again." }, { status: 500 });
  }

  if (couponId) {
    await prisma.coupon.update({ where: { id: couponId }, data: { usageCount: { increment: 1 } } });
  }

  // Fire confirmation hooks (stubbed — see lib/notifications.ts).
  const address = `${c.houseNumber}, ${c.street}${landmark ? ", " + landmark : ""}, ${c.city}, ${c.state} - ${c.pincode}`;
  await Promise.allSettled([
    sendConfirmationEmail({ orderNumber: order.orderNumber, fullName: c.fullName, mobile: c.mobile, email, total, items: orderItems, address }),
    sendWhatsAppConfirmation({ orderNumber: order.orderNumber, fullName: c.fullName, mobile: c.mobile, email, total, items: orderItems, address }),
  ]);

  // Payment is ON HOLD — returns { status: "coming_soon" }. When PhonePe is
  // enabled this returns a redirect URL the client can forward the user to.
  const payment = await initiatePayment({
    orderNumber: order.orderNumber,
    amount: total,
    customerName: c.fullName,
    mobile: c.mobile,
    redirectUrl: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/order-confirmation/${order.orderNumber}`,
    callbackUrl: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/api/payment/phonepe/callback`,
  });

  return NextResponse.json({
    orderNumber: order.orderNumber,
    payment, // { status: "coming_soon" } for now
  });
}
