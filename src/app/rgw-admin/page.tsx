import Link from "next/link";
import {
  Bell,
  CalendarDays,
  CalendarRange,
  CheckCircle2,
  Clock,
  IndianRupee,
  Package,
  Users,
} from "lucide-react";
import { getDashboardStats } from "@/lib/admin-stats";
import { OrderStatusBadge } from "@/components/admin/StatusBadge";
import { formatINR, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const s = await getDashboardStats();

  const cards = [
    { label: "Total Orders", value: String(s.total), icon: Package },
    { label: "Total Revenue", value: formatINR(s.revenue), icon: IndianRupee },
    { label: "Orders Today", value: String(s.today), icon: CalendarDays },
    { label: "This Month", value: String(s.month), icon: CalendarRange },
    { label: "Pending Orders", value: String(s.pending), icon: Clock },
    { label: "Completed", value: String(s.completed), icon: CheckCircle2 },
    { label: "Customers", value: String(s.customers), icon: Users },
  ];

  return (
    <div>
      <header className="mb-8">
        <h1 className="font-display text-4xl font-semibold text-[var(--color-maroon)]">Dashboard</h1>
        <p className="mt-1 text-[var(--color-ink-soft)]">An overview of your shop at a glance.</p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="card-lux p-5">
              <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-gold-light)] to-[var(--color-gold-deep)] text-[var(--color-maroon-deep)]">
                <Icon size={18} />
              </span>
              <p className="font-display text-3xl font-semibold text-[var(--color-maroon)]">{c.value}</p>
              <p className="text-sm text-[var(--color-ink-soft)]">{c.label}</p>
            </div>
          );
        })}
      </div>

      {/* New order notifications */}
      {s.newOrders.length > 0 && (
        <div className="mt-8 rounded-2xl border border-[var(--color-gold)]/30 bg-[var(--color-gold)]/8 p-5">
          <div className="mb-3 flex items-center gap-2">
            <Bell size={18} className="text-[var(--color-gold-deep)]" />
            <h2 className="font-serif text-lg font-bold text-[var(--color-maroon)]">
              {s.newOrders.length} new order{s.newOrders.length > 1 ? "s" : ""} need attention
            </h2>
          </div>
          <ul className="flex flex-col gap-2">
            {s.newOrders.map((o) => (
              <li key={o.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-[var(--color-ivory)] px-4 py-3 text-sm">
                <span className="font-semibold text-[var(--color-maroon)]">{o.orderNumber}</span>
                <span className="text-[var(--color-ink-soft)]">{o.fullName}</span>
                <span className="text-[var(--color-ink-soft)]">
                  {o.items.map((i) => `${i.name} ×${i.quantity}`).join(", ")}
                </span>
                <span className="font-semibold text-[var(--color-ink)]">{formatINR(o.total)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recent orders */}
      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-2xl font-bold text-[var(--color-maroon)]">Recent Orders</h2>
          <Link href="/rgw-admin/orders" className="text-sm font-semibold text-[var(--color-gold-deep)] hover:underline">
            View all →
          </Link>
        </div>
        <div className="card-lux overflow-hidden">
          {s.recent.length === 0 ? (
            <p className="p-8 text-center text-[var(--color-ink-soft)]">No orders yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-[var(--color-gold)]/20 text-xs uppercase tracking-wide text-[var(--color-ink-faint)]">
                  <tr>
                    <th className="px-5 py-3">Order</th>
                    <th className="px-5 py-3">Customer</th>
                    <th className="px-5 py-3">Total</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {s.recent.map((o) => (
                    <tr key={o.id} className="border-b border-[var(--color-gold)]/10 last:border-0">
                      <td className="px-5 py-3 font-semibold text-[var(--color-maroon)]">{o.orderNumber}</td>
                      <td className="px-5 py-3 text-[var(--color-ink-soft)]">{o.fullName}</td>
                      <td className="px-5 py-3 font-medium text-[var(--color-ink)]">{formatINR(o.total)}</td>
                      <td className="px-5 py-3"><OrderStatusBadge status={o.orderStatus} /></td>
                      <td className="px-5 py-3 text-[var(--color-ink-faint)]">{formatDate(o.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
