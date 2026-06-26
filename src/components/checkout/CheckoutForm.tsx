"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Lock, ShieldCheck } from "lucide-react";
import { useCart } from "@/components/providers/CartProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { computeDelivery } from "@/lib/pricing";
import { formatINR } from "@/lib/utils";
import type { ShippingSettings } from "@/lib/content";

const schema = z.object({
  fullName: z.string().min(2, "Please enter your full name"),
  mobile: z.string().regex(/^[0-9+\-\s]{10,15}$/, "Enter a valid mobile number"),
  email: z.union([z.string().email("Enter a valid email"), z.literal("")]).optional(),
  houseNumber: z.string().min(1, "Required"),
  street: z.string().min(2, "Please enter your street / area"),
  landmark: z.string().optional(),
  city: z.string().min(2, "Required"),
  state: z.string().min(2, "Required"),
  pincode: z.string().regex(/^\d{6}$/, "Enter a 6-digit pincode"),
});

type FormData = z.infer<typeof schema>;

export function CheckoutForm({ shipping }: { shipping: ShippingSettings }) {
  const router = useRouter();
  const { toast } = useToast();
  const { items, subtotal, discount, coupon, clear, hydrated } = useCart();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema), defaultValues: { state: "Haryana" } });

  const delivery = computeDelivery(subtotal, shipping);
  const total = Math.max(0, subtotal - discount + delivery);

  if (hydrated && items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <h2 className="font-serif text-3xl font-bold text-[var(--color-maroon)]">Nothing to check out</h2>
        <p className="text-[var(--color-ink-soft)]">Add a sweet to your box first.</p>
        <Link href="/shop" className="btn-gold mt-2">Browse Sweets</Link>
      </div>
    );
  }

  async function onSubmit(data: FormData) {
    setServerError(null);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: data,
          items: items.map((i) => ({ slug: i.slug, quantity: i.quantity })),
          couponCode: coupon?.code ?? null,
        }),
      });
      const result = await res.json();
      if (!res.ok || !result.orderNumber) {
        setServerError(result.error || "Could not place your order. Please try again.");
        return;
      }
      clear();
      toast("Order placed! Confirm on WhatsApp to finish.");
      router.push(`/order-confirmation/${result.orderNumber}`);
    } catch {
      setServerError("Network error. Please check your connection and try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
      {/* Fields */}
      <div className="flex flex-col gap-8">
        <fieldset className="card-lux p-6">
          <legend className="mb-4 font-serif text-xl font-bold text-[var(--color-maroon)]">Contact details</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full Name" error={errors.fullName?.message} className="sm:col-span-2">
              <input {...register("fullName")} className="inp" placeholder="e.g. Anjali Sharma" />
            </Field>
            <Field label="Mobile Number" error={errors.mobile?.message}>
              <input {...register("mobile")} className="inp" placeholder="10-digit mobile" inputMode="tel" />
            </Field>
            <Field label="Email (optional)" error={errors.email?.message}>
              <input {...register("email")} className="inp" placeholder="you@email.com" inputMode="email" />
            </Field>
          </div>
        </fieldset>

        <fieldset className="card-lux p-6">
          <legend className="mb-4 font-serif text-xl font-bold text-[var(--color-maroon)]">Delivery address</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="House / Flat No." error={errors.houseNumber?.message}>
              <input {...register("houseNumber")} className="inp" placeholder="e.g. 12-B" />
            </Field>
            <Field label="Street / Area" error={errors.street?.message}>
              <input {...register("street")} className="inp" placeholder="Street, locality" />
            </Field>
            <Field label="Landmark (optional)" error={errors.landmark?.message} className="sm:col-span-2">
              <input {...register("landmark")} className="inp" placeholder="Near…" />
            </Field>
            <Field label="City" error={errors.city?.message}>
              <input {...register("city")} className="inp" placeholder="e.g. Sonipat" />
            </Field>
            <Field label="State" error={errors.state?.message}>
              <input {...register("state")} className="inp" placeholder="State" />
            </Field>
            <Field label="Pincode" error={errors.pincode?.message}>
              <input {...register("pincode")} className="inp" placeholder="6-digit pincode" inputMode="numeric" />
            </Field>
          </div>
        </fieldset>

        {/* Payment — ON HOLD */}
        <fieldset className="card-lux p-6">
          <legend className="mb-1 flex items-center gap-2 font-serif text-xl font-bold text-[var(--color-maroon)]">
            Payment
            <span className="rounded-full bg-[var(--color-gold)]/15 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-[var(--color-gold-deep)]">
              Coming soon
            </span>
          </legend>
          <p className="mb-4 text-sm text-[var(--color-ink-soft)]">
            Online payment is launching shortly. Place your order now and our team will confirm it with
            you on WhatsApp to arrange a convenient payment &amp; delivery.
          </p>
          <div className="flex flex-wrap gap-2 opacity-60">
            {["PhonePe", "UPI", "Cards", "Net Banking"].map((m) => (
              <span key={m} className="flex items-center gap-1.5 rounded-lg border border-[var(--color-gold)]/30 bg-[var(--color-ivory)] px-3 py-2 text-sm text-[var(--color-ink-soft)]">
                <Lock size={13} /> {m}
              </span>
            ))}
          </div>
        </fieldset>
      </div>

      {/* Summary + submit */}
      <div className="lg:sticky lg:top-28 lg:self-start">
        <div className="card-lux p-6">
          <h2 className="font-serif text-2xl font-bold text-[var(--color-maroon)]">Your order</h2>
          <ul className="mt-4 flex flex-col gap-3">
            {items.map((i) => (
              <li key={i.slug} className="flex items-center justify-between gap-3 text-sm">
                <span className="text-[var(--color-ink-soft)]">
                  {i.name} <span className="text-[var(--color-ink-faint)]">× {i.quantity}</span>
                </span>
                <span className="font-medium text-[var(--color-ink)]">{formatINR(i.price * i.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-col gap-2 border-t border-[var(--color-gold)]/20 pt-4 text-sm">
            <Row label="Subtotal" value={formatINR(subtotal)} />
            {discount > 0 && <Row label={`Discount${coupon ? ` (${coupon.code})` : ""}`} value={`− ${formatINR(discount)}`} accent />}
            <Row label="Delivery" value={delivery === 0 ? "FREE" : formatINR(delivery)} accent={delivery === 0} />
            <div className="mt-2 flex items-center justify-between border-t border-[var(--color-gold)]/20 pt-3">
              <span className="font-serif text-lg font-bold text-[var(--color-maroon)]">Total</span>
              <span className="font-serif text-2xl font-bold text-[var(--color-maroon)]">{formatINR(total)}</span>
            </div>
          </div>

          {serverError && (
            <p className="mt-4 rounded-lg bg-[var(--color-maroon)]/10 px-4 py-3 text-sm text-[var(--color-maroon)]">{serverError}</p>
          )}

          <button type="submit" disabled={isSubmitting} className="btn-gold mt-5 w-full justify-center disabled:opacity-60">
            {isSubmitting ? "Placing order…" : `Place Order · ${formatINR(total)}`}
          </button>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-[var(--color-ink-faint)]">
            <ShieldCheck size={13} /> Your details are kept private &amp; secure.
          </p>
        </div>
      </div>
    </form>
  );
}

function Field({
  label,
  error,
  children,
  className,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`flex flex-col gap-1.5 ${className ?? ""}`}>
      <span className="text-sm font-medium text-[var(--color-ink-soft)]">{label}</span>
      {children}
      {error && <span className="text-xs text-[var(--color-maroon-soft)]">{error}</span>}
    </label>
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
