import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { CouponsManager, type AdminCoupon } from "@/components/admin/CouponsManager";

export const dynamic = "force-dynamic";

export default async function AdminCouponsPage() {
  const session = await requireAdmin();
  const rows = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });
  const coupons: AdminCoupon[] = rows.map((c) => ({
    id: c.id,
    code: c.code,
    type: c.type,
    value: c.value,
    minOrder: c.minOrder,
    expiresAt: c.expiresAt ? c.expiresAt.toISOString() : null,
    active: c.active,
    usageCount: c.usageCount,
  }));

  return (
    <div>
      <header className="mb-8">
        <h1 className="font-display text-4xl font-semibold text-[var(--color-maroon)]">Coupons</h1>
        <p className="mt-1 text-[var(--color-ink-soft)]">Create and manage discount codes.</p>
      </header>
      <CouponsManager coupons={coupons} role={session.role} />
    </div>
  );
}
