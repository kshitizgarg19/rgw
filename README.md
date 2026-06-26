# RGW Sweets — Premium Heritage Mithai E-Commerce

An immersive, luxury e-commerce experience for **RGW Sweets** (Rajender Mittal · Gajar Pak Wale) —
*Traditional Mithai Since 1950*. Two signature products: **Mawa Barfi** and **Ghiya Barfi** (₹750 / 1 Kg).

Built to feel like walking into a candlelit heritage sweet shop: cinematic dark hero, editorial
serif typography, gold detailing, spotlit product staging, drag-to-rotate product viewer, smooth
momentum scroll, and a full admin panel.

---

## Tech stack

- **Next.js 16** (App Router, Turbopack) · React 19 · TypeScript
- **Tailwind CSS v4** (design system in `src/app/globals.css`)
- **Framer Motion** + **Lenis** (smooth scroll) — cinematic, CSS-3D / pseudo-3D experience
- **Prisma + SQLite** (dev) — swap to Postgres for production
- **jose** (JWT) + **bcryptjs** — admin auth (roles: Super Admin / Staff Admin)

---

## Getting started

```bash
npm install            # also runs `prisma generate`
npm run db:push        # create the SQLite database from the schema
npm run db:seed        # seed 2 products, admins, reviews, coupons, settings
npm run dev            # http://localhost:3000
```

Useful scripts: `npm run db:studio` (visual DB browser), `npm run db:reset` (wipe + reseed),
`npm run build` (production build).

---

## Admin panel

- **Login:** http://localhost:3000/rgw-admin-login
- **Super Admin:** `admin@rgwsweets.in` · `RGW@admin2026`
- **Staff Admin:** `staff@rgwsweets.in` · `RGW@staff2026`

(Change these via `.env` before the first seed, and rotate `JWT_SECRET` for production.)

Admin covers: dashboard stats + new-order notifications, order management (status + payment),
product management (add/edit/delete/price/stock/images/show-hide), customers + order history,
coupons, and content/settings (shipping charges, review moderation).

---

## ⭐ Adding the real product photos & logo

The site ships with tasteful **placeholder SVGs** that float on dark spotlit stages. To use your
real photography:

1. **Drop your image files** into `public/products/` — e.g.
   `mawa-barfi.jpg`, `mawa-barfi-tray.jpg`, `ghiya-barfi.jpg`, `ghiya-barfi-tray.jpg`.
   (Square images with a transparent or clean background look best on the dark stages.)
2. Go to **/rgw-admin → Products → Edit** a product and set **Image paths** (one per line), e.g.
   ```
   /products/mawa-barfi.jpg
   /products/mawa-barfi-tray.jpg
   ```
   — or use the **Upload image** button (saves to `public/uploads/` and fills the path for you).
3. **Logo:** replace `public/brand/rgw-logo.svg` with your logo (used in the footer / OG image).
4. **Hero backdrop** (optional): `public/brand/shop-scene.svg` is the glowing shop-interior layer.

No code changes needed — images are data-driven from the database.

---

## Payment — ON HOLD (next phase)

Online payment is intentionally **not** wired up yet. The full cart → checkout → confirmation flow
works; orders are saved as **"Pending Payment"** and confirmed with the customer over WhatsApp.

The PhonePe integration point is ready in `src/lib/payment/phonepe.ts` (`initiatePayment()` +
config). Flip `PAYMENT_ENABLED` and implement the documented request to go live — no flow rebuild
needed. (No Cash on Delivery / Pay Later / Bank Transfer, by design.)

---

## Deploying to production

SQLite is great for local dev. For Vercel / serverless:

1. In `prisma/schema.prisma` change `datasource.provider` to `"postgresql"`.
2. Set `DATABASE_URL` to your Postgres connection string, plus `JWT_SECRET`, `ADMIN_*`,
   and `NEXT_PUBLIC_SITE_URL`.
3. `npx prisma migrate deploy` (or `db push`) + `npm run db:seed`.
4. Update `SITE.url` in `src/lib/constants.ts` to your domain (for SEO / sitemap / OG).
5. For image uploads on serverless, swap the local `public/uploads` writer in
   `src/app/api/admin/upload/route.ts` for a blob store (e.g. Vercel Blob / S3).

---

## Project map

```
src/
  app/                  pages + route handlers + admin + sitemap/robots/og
  components/
    home/  product/  shop/  cart/  checkout/  admin/  legal/  contact/
    layout/  ui/  providers/  seo/
  lib/                  db, auth, catalog, pricing, content, payment, constants…
prisma/                 schema.prisma + seed.ts
public/                 products/  brand/  uploads/
```
