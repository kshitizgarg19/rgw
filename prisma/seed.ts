import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { PRODUCTS } from "../src/lib/constants";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding RGW Sweets…");

  // ── Products ──────────────────────────────────────────────────────────
  for (let i = 0; i < PRODUCTS.length; i++) {
    const p = PRODUCTS[i];
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        tagline: p.tagline,
        price: p.price,
        weight: p.weight,
        accent: p.accent,
        shortDescription: p.shortDescription,
        description: p.description,
        story: p.story,
        ingredients: JSON.stringify(p.ingredients),
        notes: JSON.stringify(p.notes),
        images: JSON.stringify(p.images),
        sortOrder: i,
      },
      create: {
        slug: p.slug,
        name: p.name,
        tagline: p.tagline,
        price: p.price,
        weight: p.weight,
        accent: p.accent,
        shortDescription: p.shortDescription,
        description: p.description,
        story: p.story,
        ingredients: JSON.stringify(p.ingredients),
        notes: JSON.stringify(p.notes),
        images: JSON.stringify(p.images),
        sortOrder: i,
        stock: 100,
        active: true,
      },
    });
  }
  console.log(`  ✓ ${PRODUCTS.length} products`);

  // ── Super Admin ───────────────────────────────────────────────────────
  const email = process.env.ADMIN_EMAIL || "admin@rgwsweets.in";
  const password = process.env.ADMIN_PASSWORD || "RGW@admin2026";
  const name = process.env.ADMIN_NAME || "RGW Super Admin";
  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.adminUser.upsert({
    where: { email },
    update: { name, role: "SUPER_ADMIN" },
    create: { email, name, passwordHash, role: "SUPER_ADMIN" },
  });
  console.log(`  ✓ super admin: ${email}`);

  // A staff admin example
  await prisma.adminUser.upsert({
    where: { email: "staff@rgwsweets.in" },
    update: {},
    create: {
      email: "staff@rgwsweets.in",
      name: "Counter Staff",
      passwordHash: await bcrypt.hash("RGW@staff2026", 10),
      role: "STAFF_ADMIN",
    },
  });

  // ── Reviews ───────────────────────────────────────────────────────────
  const reviewCount = await prisma.review.count();
  if (reviewCount === 0) {
    await prisma.review.createMany({
      data: [
        { customerName: "Anjali Sharma", productSlug: "mawa-barfi", rating: 5, comment: "Tastes exactly like the barfi from my childhood. Fresh, soft, and not too sweet. Ordering again for Diwali!" },
        { customerName: "Rohit Verma", productSlug: "ghiya-barfi", rating: 5, comment: "I had never tried ghiya barfi before — absolutely melts in the mouth. You can tell it's made fresh." },
        { customerName: "Meera Gupta", productSlug: null, rating: 5, comment: "Packaging was beautiful and delivery to Gurgaon was quick. Felt like a premium gift." },
        { customerName: "Sandeep Aggarwal", productSlug: "mawa-barfi", rating: 4, comment: "Lovely quality mawa. Reminds me of old Samalkha halwai days. Would love a slightly bigger pack option." },
        { customerName: "Priya Nair", productSlug: "ghiya-barfi", rating: 5, comment: "The pistachio finish is gorgeous. My family finished the box in a day!" },
      ],
    });
    console.log("  ✓ sample reviews");
  }

  // ── Coupons ───────────────────────────────────────────────────────────
  await prisma.coupon.upsert({
    where: { code: "WELCOME10" },
    update: {},
    create: { code: "WELCOME10", type: "PERCENT", value: 10, minOrder: 0, active: true },
  });
  await prisma.coupon.upsert({
    where: { code: "FESTIVE100" },
    update: {},
    create: { code: "FESTIVE100", type: "FIXED", value: 100, minOrder: 1400, active: true },
  });
  console.log("  ✓ coupons: WELCOME10, FESTIVE100");

  // ── Editable site settings ────────────────────────────────────────────
  await prisma.siteContent.upsert({
    where: { key: "shipping" },
    update: {},
    create: {
      key: "shipping",
      value: JSON.stringify({ charge: 49, freeAbove: 1500, etaText: "Delivered fresh across Delhi NCR within 24–48 hours." }),
    },
  });

  // Recompute product rating aggregates from seeded reviews
  await refreshRatings();

  console.log("✅ Seed complete.");
}

async function refreshRatings() {
  const products = await prisma.product.findMany();
  for (const p of products) {
    const agg = await prisma.review.aggregate({
      where: { productSlug: p.slug, approved: true },
      _avg: { rating: true },
      _count: { rating: true },
    });
    await prisma.product.update({
      where: { id: p.id },
      data: {
        ratingAvg: agg._avg.rating ?? 0,
        ratingCount: agg._count.rating ?? 0,
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
