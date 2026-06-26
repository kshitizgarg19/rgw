import type { Metadata } from "next";
import { getShippingSettings } from "@/lib/content";
import { CartView } from "@/components/cart/CartView";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Your Cart",
  description: "Review your RGW Sweets order before checkout.",
  robots: { index: false, follow: true },
};

export default async function CartPage() {
  const shipping = await getShippingSettings();
  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-32">
      <h1 className="font-serif text-4xl font-bold text-[var(--color-maroon)] sm:text-5xl">Your Cart</h1>
      <p className="mb-10 mt-2 text-[var(--color-ink-soft)]">Review your box before checkout.</p>
      <CartView shipping={shipping} />
    </div>
  );
}
