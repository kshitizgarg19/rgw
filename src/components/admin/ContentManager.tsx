"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, EyeOff, Save, Trash2 } from "lucide-react";
import { updateShipping, moderateReview } from "@/app/rgw-admin/actions";
import { useToast } from "@/components/providers/ToastProvider";
import { Stars } from "@/components/ui/StarRating";
import { formatDateShort, cn } from "@/lib/utils";
import type { ShippingSettings } from "@/lib/content";

type AdminReview = {
  id: string;
  productSlug: string | null;
  customerName: string;
  rating: number;
  comment: string;
  approved: boolean;
  createdAt: string;
};

export function ContentManager({
  shipping,
  reviews,
}: {
  shipping: ShippingSettings;
  reviews: AdminReview[];
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [pending, startTransition] = useTransition();
  const [ship, setShip] = useState({
    charge: String(shipping.charge),
    freeAbove: String(shipping.freeAbove),
    etaText: shipping.etaText,
  });

  function saveShipping() {
    startTransition(async () => {
      const r = await updateShipping({
        charge: Number(ship.charge),
        freeAbove: Number(ship.freeAbove),
        etaText: ship.etaText,
      });
      toast(r.ok ? "Shipping settings saved" : r.error || "Failed", r.ok ? "success" : "info");
      router.refresh();
    });
  }

  function review(id: string, action: "approve" | "hide" | "delete") {
    if (action === "delete" && !confirm("Delete this review?")) return;
    startTransition(async () => {
      await moderateReview(id, action);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Shipping */}
      <section className="card-lux p-6">
        <h2 className="font-serif text-xl font-bold text-[var(--color-maroon)]">Delivery &amp; Shipping</h2>
        <p className="mb-4 text-sm text-[var(--color-ink-soft)]">These apply live to the cart and checkout.</p>
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-[var(--color-ink-soft)]">Delivery charge (₹)</span>
            <input type="number" className="inp" value={ship.charge} onChange={(e) => setShip({ ...ship, charge: e.target.value })} />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-[var(--color-ink-soft)]">Free delivery above (₹)</span>
            <input type="number" className="inp" value={ship.freeAbove} onChange={(e) => setShip({ ...ship, freeAbove: e.target.value })} />
          </label>
          <label className="flex flex-col gap-1.5 sm:col-span-3">
            <span className="text-sm font-medium text-[var(--color-ink-soft)]">Delivery note</span>
            <input className="inp" value={ship.etaText} onChange={(e) => setShip({ ...ship, etaText: e.target.value })} />
          </label>
        </div>
        <button onClick={saveShipping} disabled={pending} className="btn-gold mt-4 disabled:opacity-60">
          <Save size={16} /> Save Settings
        </button>
      </section>

      {/* Reviews moderation */}
      <section>
        <h2 className="mb-1 font-serif text-xl font-bold text-[var(--color-maroon)]">Customer Reviews</h2>
        <p className="mb-4 text-sm text-[var(--color-ink-soft)]">Approve, hide or remove reviews. Hidden reviews don&apos;t affect ratings.</p>
        {reviews.length === 0 ? (
          <p className="card-lux p-8 text-center text-[var(--color-ink-soft)]">No reviews yet.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {reviews.map((r) => (
              <div key={r.id} className={cn("card-lux flex flex-col gap-2 p-4", !r.approved && "opacity-70")}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-[var(--color-maroon)]">{r.customerName}</span>
                    <Stars value={r.rating} size={14} />
                    {r.productSlug && <span className="text-xs text-[var(--color-ink-faint)]">on {r.productSlug}</span>}
                    {!r.approved && <span className="rounded-full bg-[var(--color-ink)]/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-[var(--color-ink-soft)]">Hidden</span>}
                  </div>
                  <span className="text-xs text-[var(--color-ink-faint)]">{formatDateShort(r.createdAt)}</span>
                </div>
                <p className="text-sm text-[var(--color-ink-soft)]">{r.comment}</p>
                <div className="flex gap-2">
                  {r.approved ? (
                    <button onClick={() => review(r.id, "hide")} className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--color-gold)]/30 px-3 py-1.5 text-xs font-semibold text-[var(--color-ink-soft)] hover:bg-[var(--color-gold)]/10">
                      <EyeOff size={13} /> Hide
                    </button>
                  ) : (
                    <button onClick={() => review(r.id, "approve")} className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--color-pistachio-deep)]/40 px-3 py-1.5 text-xs font-semibold text-[var(--color-pistachio-deep)] hover:bg-[var(--color-pistachio)]/10">
                      <Check size={13} /> Approve
                    </button>
                  )}
                  <button onClick={() => review(r.id, "delete")} className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--color-maroon)]/30 px-3 py-1.5 text-xs font-semibold text-[var(--color-maroon)] hover:bg-[var(--color-maroon)]/10">
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
