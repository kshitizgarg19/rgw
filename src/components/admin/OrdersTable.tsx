"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, MapPin, Phone } from "lucide-react";
import { OrderStatusBadge, PaymentBadge } from "@/components/admin/StatusBadge";
import { updateOrderStatus, updatePaymentStatus } from "@/app/rgw-admin/actions";
import { ORDER_STATUSES } from "@/lib/constants";
import { formatINR, formatDate, cn } from "@/lib/utils";

export type AdminOrder = {
  id: string;
  orderNumber: string;
  fullName: string;
  mobile: string;
  email: string | null;
  address: string;
  items: { id: string; name: string; quantity: number; lineTotal: number }[];
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  total: number;
  couponCode: string | null;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
};

export function OrdersTable({ orders }: { orders: AdminOrder[] }) {
  const [open, setOpen] = useState<string | null>(null);
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function setStatus(id: string, status: string) {
    startTransition(async () => {
      await updateOrderStatus(id, status);
      router.refresh();
    });
  }
  function setPayment(id: string, status: string) {
    startTransition(async () => {
      await updatePaymentStatus(id, status);
      router.refresh();
    });
  }

  if (orders.length === 0) {
    return <p className="card-lux p-10 text-center text-[var(--color-ink-soft)]">No orders yet.</p>;
  }

  return (
    <div className={cn("card-lux overflow-hidden", pending && "opacity-70")}>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[var(--color-gold)]/20 text-xs uppercase tracking-wide text-[var(--color-ink-faint)]">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <FragmentRow
                key={o.id}
                o={o}
                open={open === o.id}
                onToggle={() => setOpen(open === o.id ? null : o.id)}
                onStatus={(s) => setStatus(o.id, s)}
                onPayment={(s) => setPayment(o.id, s)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FragmentRow({
  o,
  open,
  onToggle,
  onStatus,
  onPayment,
}: {
  o: AdminOrder;
  open: boolean;
  onToggle: () => void;
  onStatus: (s: string) => void;
  onPayment: (s: string) => void;
}) {
  return (
    <>
      <tr className="border-b border-[var(--color-gold)]/10">
        <td className="px-4 py-3">
          <p className="font-semibold text-[var(--color-maroon)]">{o.orderNumber}</p>
          <p className="text-xs text-[var(--color-ink-faint)]">{formatDate(o.createdAt)}</p>
        </td>
        <td className="px-4 py-3 text-[var(--color-ink-soft)]">
          {o.fullName}
          <br />
          <span className="text-xs">{o.mobile}</span>
        </td>
        <td className="px-4 py-3 font-medium text-[var(--color-ink)]">{formatINR(o.total)}</td>
        <td className="px-4 py-3">
          <select
            value={o.paymentStatus}
            onChange={(e) => onPayment(e.target.value)}
            className="rounded-lg border border-[var(--color-gold)]/30 bg-[var(--color-ivory)] px-2 py-1 text-xs text-[var(--color-ink)] outline-none"
          >
            <option value="PENDING">Pending</option>
            <option value="PAID">Paid</option>
            <option value="FAILED">Failed</option>
          </select>
        </td>
        <td className="px-4 py-3">
          <select
            value={o.orderStatus}
            onChange={(e) => onStatus(e.target.value)}
            className="rounded-lg border border-[var(--color-gold)]/30 bg-[var(--color-ivory)] px-2 py-1 text-xs font-semibold text-[var(--color-maroon)] outline-none"
          >
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0) + s.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
        </td>
        <td className="px-4 py-3 text-right">
          <button onClick={onToggle} aria-label="Details" className="text-[var(--color-ink-soft)] hover:text-[var(--color-maroon)]">
            <ChevronDown size={18} className={cn("transition-transform", open && "rotate-180")} />
          </button>
        </td>
      </tr>
      {open && (
        <tr className="bg-[var(--color-parchment)]/40">
          <td colSpan={6} className="px-4 py-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-faint)]">Items</p>
                <ul className="text-sm text-[var(--color-ink-soft)]">
                  {o.items.map((i) => (
                    <li key={i.id} className="flex justify-between">
                      <span>{i.name} × {i.quantity}</span>
                      <span>{formatINR(i.lineTotal)}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-2 border-t border-[var(--color-gold)]/20 pt-2 text-sm">
                  <Row label="Subtotal" value={formatINR(o.subtotal)} />
                  {o.discount > 0 && <Row label={`Discount${o.couponCode ? ` (${o.couponCode})` : ""}`} value={`− ${formatINR(o.discount)}`} />}
                  <Row label="Delivery" value={o.deliveryCharge === 0 ? "FREE" : formatINR(o.deliveryCharge)} />
                  <Row label="Total" value={formatINR(o.total)} bold />
                </div>
              </div>
              <div className="text-sm text-[var(--color-ink-soft)]">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-faint)]">Delivery</p>
                <p className="flex items-start gap-2"><MapPin size={15} className="mt-0.5 shrink-0 text-[var(--color-gold-deep)]" /> {o.address}</p>
                <p className="mt-1 flex items-center gap-2"><Phone size={15} className="shrink-0 text-[var(--color-gold-deep)]" /> {o.mobile}</p>
                {o.email && <p className="mt-1">{o.email}</p>}
                <div className="mt-3 flex gap-2">
                  <OrderStatusBadge status={o.orderStatus} />
                  <PaymentBadge status={o.paymentStatus} />
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={cn("flex justify-between", bold && "font-bold text-[var(--color-maroon)]")}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
