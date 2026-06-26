"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, ToggleLeft, ToggleRight, Trash2 } from "lucide-react";
import { createCoupon, toggleCoupon, deleteCoupon } from "@/app/rgw-admin/actions";
import { useToast } from "@/components/providers/ToastProvider";
import { formatINR, formatDateShort, cn } from "@/lib/utils";
import type { AdminRole } from "@/lib/types";

export type AdminCoupon = {
  id: string;
  code: string;
  type: string;
  value: number;
  minOrder: number;
  expiresAt: string | null;
  active: boolean;
  usageCount: number;
};

export function CouponsManager({ coupons, role }: { coupons: AdminCoupon[]; role: AdminRole }) {
  const isSuper = role === "SUPER_ADMIN";
  const router = useRouter();
  const { toast } = useToast();
  const [pending, startTransition] = useTransition();
  const [form, setForm] = useState({ code: "", type: "PERCENT", value: "10", minOrder: "0", expiresAt: "" });

  function create() {
    startTransition(async () => {
      const r = await createCoupon({
        code: form.code,
        type: form.type as "PERCENT" | "FIXED",
        value: Number(form.value),
        minOrder: Number(form.minOrder),
        expiresAt: form.expiresAt || undefined,
      });
      if (r.ok) {
        toast("Coupon created");
        setForm({ code: "", type: "PERCENT", value: "10", minOrder: "0", expiresAt: "" });
        router.refresh();
      } else {
        toast(r.error || "Failed", "info");
      }
    });
  }

  function toggle(c: AdminCoupon) {
    startTransition(async () => {
      await toggleCoupon(c.id, !c.active);
      router.refresh();
    });
  }

  function remove(c: AdminCoupon) {
    if (!confirm(`Delete coupon ${c.code}?`)) return;
    startTransition(async () => {
      await deleteCoupon(c.id);
      router.refresh();
    });
  }

  return (
    <div>
      {isSuper && (
        <div className="card-lux mb-6 p-5">
          <h2 className="mb-3 font-serif text-lg font-bold text-[var(--color-maroon)]">Create coupon</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <input className="inp" placeholder="CODE" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} />
            <select className="inp" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              <option value="PERCENT">% off</option>
              <option value="FIXED">₹ off</option>
            </select>
            <input className="inp" type="number" placeholder="Value" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} />
            <input className="inp" type="number" placeholder="Min order ₹" value={form.minOrder} onChange={(e) => setForm({ ...form, minOrder: e.target.value })} />
            <input className="inp" type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} />
          </div>
          <button onClick={create} disabled={pending || !form.code} className="btn-gold mt-4 disabled:opacity-60">
            <Plus size={16} /> Add Coupon
          </button>
        </div>
      )}

      <div className="card-lux overflow-hidden">
        {coupons.length === 0 ? (
          <p className="p-8 text-center text-[var(--color-ink-soft)]">No coupons yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-[var(--color-gold)]/20 text-xs uppercase tracking-wide text-[var(--color-ink-faint)]">
                <tr>
                  <th className="px-4 py-3">Code</th>
                  <th className="px-4 py-3">Discount</th>
                  <th className="px-4 py-3">Min order</th>
                  <th className="px-4 py-3">Expires</th>
                  <th className="px-4 py-3">Used</th>
                  <th className="px-4 py-3">Active</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((c) => (
                  <tr key={c.id} className="border-b border-[var(--color-gold)]/10 last:border-0">
                    <td className="px-4 py-3 font-semibold text-[var(--color-maroon)]">{c.code}</td>
                    <td className="px-4 py-3 text-[var(--color-ink-soft)]">{c.type === "PERCENT" ? `${c.value}%` : formatINR(c.value)}</td>
                    <td className="px-4 py-3 text-[var(--color-ink-soft)]">{c.minOrder ? formatINR(c.minOrder) : "—"}</td>
                    <td className="px-4 py-3 text-[var(--color-ink-faint)]">{c.expiresAt ? formatDateShort(c.expiresAt) : "Never"}</td>
                    <td className="px-4 py-3 text-[var(--color-ink-soft)]">{c.usageCount}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggle(c)} className={cn("transition-colors", c.active ? "text-[var(--color-pistachio-deep)]" : "text-[var(--color-ink-faint)]")}>
                        {c.active ? <ToggleRight size={26} /> : <ToggleLeft size={26} />}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {isSuper && (
                        <button onClick={() => remove(c)} aria-label="Delete" className="text-[var(--color-ink-faint)] hover:text-[var(--color-maroon)]">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
