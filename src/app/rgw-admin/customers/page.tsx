import { prisma } from "@/lib/db";
import { OrderStatusBadge } from "@/components/admin/StatusBadge";
import { formatINR, formatDateShort } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  const customers = await prisma.customer.findMany({
    include: { orders: { orderBy: { createdAt: "desc" } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <header className="mb-8">
        <h1 className="font-display text-4xl font-semibold text-[var(--color-maroon)]">Customers</h1>
        <p className="mt-1 text-[var(--color-ink-soft)]">{customers.length} customer{customers.length === 1 ? "" : "s"} · spend &amp; order history.</p>
      </header>

      {customers.length === 0 ? (
        <p className="card-lux p-10 text-center text-[var(--color-ink-soft)]">No customers yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {customers.map((c) => {
            const spend = c.orders.reduce((s, o) => s + o.total, 0);
            return (
              <details key={c.id} className="card-lux overflow-hidden">
                <summary className="flex cursor-pointer flex-wrap items-center justify-between gap-3 px-5 py-4 marker:content-['']">
                  <div className="min-w-0">
                    <p className="font-serif text-lg font-bold text-[var(--color-maroon)]">{c.name}</p>
                    <p className="text-sm text-[var(--color-ink-soft)]">
                      {c.phone}{c.email ? ` · ${c.email}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-center">
                      <p className="font-semibold text-[var(--color-maroon)]">{c.orders.length}</p>
                      <p className="text-xs text-[var(--color-ink-faint)]">Orders</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-[var(--color-maroon)]">{formatINR(spend)}</p>
                      <p className="text-xs text-[var(--color-ink-faint)]">Spend</p>
                    </div>
                  </div>
                </summary>
                <div className="border-t border-[var(--color-gold)]/15 bg-[var(--color-parchment)]/30 px-5 py-3">
                  {c.orders.length === 0 ? (
                    <p className="py-2 text-sm text-[var(--color-ink-faint)]">No orders.</p>
                  ) : (
                    <ul className="flex flex-col gap-1.5">
                      {c.orders.map((o) => (
                        <li key={o.id} className="flex flex-wrap items-center justify-between gap-2 text-sm">
                          <span className="font-medium text-[var(--color-maroon)]">{o.orderNumber}</span>
                          <span className="text-[var(--color-ink-faint)]">{formatDateShort(o.createdAt)}</span>
                          <OrderStatusBadge status={o.orderStatus} />
                          <span className="font-semibold text-[var(--color-ink)]">{formatINR(o.total)}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </details>
            );
          })}
        </div>
      )}
    </div>
  );
}
