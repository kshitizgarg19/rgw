import type { Metadata } from "next";
import { getShippingSettings } from "@/lib/content";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your RGW Sweets order.",
  robots: { index: false, follow: true },
};

export default async function CheckoutPage() {
  const shipping = await getShippingSettings();
  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-32">
      <h1 className="font-serif text-4xl font-bold text-[var(--color-maroon)] sm:text-5xl">Checkout</h1>
      <p className="mb-10 mt-2 text-[var(--color-ink-soft)]">
        Almost there — just your delivery details and your sweets are on their way.
      </p>
      <CheckoutForm shipping={shipping} />
    </div>
  );
}
