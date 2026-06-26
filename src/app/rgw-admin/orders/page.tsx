import { prisma } from "@/lib/db";
import { OrdersTable, type AdminOrder } from "@/components/admin/OrdersTable";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const rows = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  const orders: AdminOrder[] = rows.map((o) => ({
    id: o.id,
    orderNumber: o.orderNumber,
    fullName: o.fullName,
    mobile: o.mobile,
    email: o.email,
    address: `${o.houseNumber}, ${o.street}${o.landmark ? ", " + o.landmark : ""}, ${o.city}, ${o.state} - ${o.pincode}`,
    items: o.items.map((i) => ({ id: i.id, name: i.name, quantity: i.quantity, lineTotal: i.lineTotal })),
    subtotal: o.subtotal,
    deliveryCharge: o.deliveryCharge,
    discount: o.discount,
    total: o.total,
    couponCode: o.couponCode,
    paymentStatus: o.paymentStatus,
    orderStatus: o.orderStatus,
    createdAt: o.createdAt.toISOString(),
  }));

  return (
    <div>
      <header className="mb-8">
        <h1 className="font-display text-4xl font-semibold text-[var(--color-maroon)]">Orders</h1>
        <p className="mt-1 text-[var(--color-ink-soft)]">
          {orders.length} order{orders.length === 1 ? "" : "s"} · update payment &amp; fulfilment status inline.
        </p>
      </header>
      <OrdersTable orders={orders} />
    </div>
  );
}
