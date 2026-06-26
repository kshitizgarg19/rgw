import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, MessageCircle, Phone } from "lucide-react";
import { getOrderByNumber } from "@/lib/orders";
import { ConfirmationSeal } from "@/components/checkout/ConfirmationSeal";
import { customerWhatsAppLink } from "@/lib/notifications";
import { formatINR, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Order Confirmed",
  robots: { index: false, follow: false },
};

export default async function ConfirmationPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  const order = await getOrderByNumber(orderNumber);
  if (!order) notFound();

  const firstName = order.fullName.split(" ")[0];
  const address = `${order.houseNumber}, ${order.street}${order.landmark ? ", " + order.landmark : ""}, ${order.city}, ${order.state} - ${order.pincode}`;
  const waLink = customerWhatsAppLink({
    orderNumber: order.orderNumber,
    fullName: order.fullName,
    mobile: order.mobile,
    total: order.total,
    items: order.items.map((i) => ({ name: i.name, quantity: i.quantity })),
    address,
  });

  return (
    <div className="mx-auto max-w-3xl px-6 pb-24 pt-36">
      {/* Hero */}
      <div className="text-center">
        <ConfirmationSeal />
        <p className="eyebrow mt-6">Order Placed</p>
        <h1 className="mt-2 font-serif text-4xl font-bold tracking-tight text-[var(--color-maroon)] sm:text-5xl">
          Thank you, <span className="text-foil">{firstName}</span>!
        </h1>
        <p className="mx-auto mt-4 max-w-md text-[var(--color-ink-soft)]">
          Your order has been received. Here are the details — please confirm on WhatsApp so we can
          arrange payment and fresh delivery.
        </p>
      </div>

      {/* Order meta */}
      <div className="card-lux mt-10 grid gap-4 p-6 sm:grid-cols-3">
        <Meta label="Order Number" value={order.orderNumber} />
        <Meta label="Placed On" value={formatDate(order.createdAt)} />
        <Meta
          label="Status"
          value={
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-gold)]/15 px-3 py-1 text-sm font-semibold text-[var(--color-gold-deep)]">
              Pending Payment
            </span>
          }
        />
        <div className="sm:col-span-3 border-t border-[var(--color-gold)]/20 pt-3">
          <p className="text-xs uppercase tracking-wide text-[var(--color-ink-faint)]">Payment Reference</p>
          <p className="text-sm text-[var(--color-ink-soft)]">
            {order.paymentRef ?? "— will be generated once online payment goes live —"}
          </p>
        </div>
      </div>

      {/* WhatsApp confirm */}
      <div className="mt-6 rounded-2xl bg-gradient-to-br from-[#1ba94c] to-[#0e7a36] p-6 text-white">
        <h2 className="font-serif text-xl font-bold">One last step</h2>
        <p className="mt-1 text-sm text-white/85">
          Online payment is coming soon. Tap below to confirm your order with us on WhatsApp — we&apos;ll
          take it from there.
        </p>
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-[#0e7a36] transition-transform hover:scale-[1.02]"
        >
          <MessageCircle size={18} fill="currentColor" /> Confirm on WhatsApp
        </a>
      </div>

      {/* Summary */}
      <div className="card-lux mt-6 p-6">
        <h2 className="font-serif text-xl font-bold text-[var(--color-maroon)]">Order Summary</h2>
        <ul className="mt-4 flex flex-col gap-3">
          {order.items.map((i) => (
            <li key={i.id} className="flex items-center justify-between gap-3 text-sm">
              <span className="text-[var(--color-ink-soft)]">
                {i.name} <span className="text-[var(--color-ink-faint)]">× {i.quantity}</span>
              </span>
              <span className="font-medium text-[var(--color-ink)]">{formatINR(i.lineTotal)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex flex-col gap-2 border-t border-[var(--color-gold)]/20 pt-4 text-sm">
          <Row label="Subtotal" value={formatINR(order.subtotal)} />
          {order.discount > 0 && <Row label={`Discount${order.couponCode ? ` (${order.couponCode})` : ""}`} value={`− ${formatINR(order.discount)}`} accent />}
          <Row label="Delivery" value={order.deliveryCharge === 0 ? "FREE" : formatINR(order.deliveryCharge)} accent={order.deliveryCharge === 0} />
          <div className="mt-2 flex items-center justify-between border-t border-[var(--color-gold)]/20 pt-3">
            <span className="font-serif text-lg font-bold text-[var(--color-maroon)]">Total</span>
            <span className="font-serif text-2xl font-bold text-[var(--color-maroon)]">{formatINR(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Delivery info */}
      <div className="card-lux mt-6 p-6">
        <h2 className="font-serif text-xl font-bold text-[var(--color-maroon)]">Delivery Information</h2>
        <div className="mt-4 flex flex-col gap-3 text-sm text-[var(--color-ink-soft)]">
          <p className="font-semibold text-[var(--color-ink)]">{order.fullName}</p>
          <p className="flex items-start gap-2">
            <MapPin size={16} className="mt-0.5 shrink-0 text-[var(--color-gold-deep)]" /> {address}
          </p>
          <p className="flex items-center gap-2">
            <Phone size={16} className="shrink-0 text-[var(--color-gold-deep)]" /> {order.mobile}
          </p>
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <Link href="/shop" className="btn-outline">Continue Shopping</Link>
      </div>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-[var(--color-ink-faint)]">{label}</p>
      <p className="mt-1 font-semibold text-[var(--color-maroon)]">{value}</p>
    </div>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[var(--color-ink-soft)]">{label}</span>
      <span className={accent ? "font-semibold text-[var(--color-pistachio-deep)]" : "font-medium text-[var(--color-ink)]"}>
        {value}
      </span>
    </div>
  );
}
