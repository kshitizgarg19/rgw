import { cn } from "@/lib/utils";

const ORDER_MAP: Record<string, { label: string; cls: string }> = {
  NEW: { label: "New", cls: "bg-[#e0982b]/15 text-[#a86f15]" },
  PROCESSING: { label: "Processing", cls: "bg-[#3b82c4]/15 text-[#2563a0]" },
  SHIPPED: { label: "Shipped", cls: "bg-[#7c5cc4]/15 text-[#5b3fa0]" },
  DELIVERED: { label: "Delivered", cls: "bg-[var(--color-pistachio)]/20 text-[var(--color-pistachio-deep)]" },
  CANCELLED: { label: "Cancelled", cls: "bg-[var(--color-maroon)]/12 text-[var(--color-maroon)]" },
};

const PAY_MAP: Record<string, { label: string; cls: string }> = {
  PENDING: { label: "Pending Payment", cls: "bg-[var(--color-gold)]/15 text-[var(--color-gold-deep)]" },
  PAID: { label: "Paid", cls: "bg-[var(--color-pistachio)]/20 text-[var(--color-pistachio-deep)]" },
  FAILED: { label: "Failed", cls: "bg-[var(--color-maroon)]/12 text-[var(--color-maroon)]" },
};

export function OrderStatusBadge({ status }: { status: string }) {
  const s = ORDER_MAP[status] ?? ORDER_MAP.NEW;
  return <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-semibold", s.cls)}>{s.label}</span>;
}

export function PaymentBadge({ status }: { status: string }) {
  const s = PAY_MAP[status] ?? PAY_MAP.PENDING;
  return <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-semibold", s.cls)}>{s.label}</span>;
}
