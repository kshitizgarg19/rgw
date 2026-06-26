import type { Metadata } from "next";
import { getProducts } from "@/lib/catalog";
import { ShopGrid } from "@/components/shop/ShopGrid";
import { PageHeader } from "@/components/ui/PageHeader";
import { BreadcrumbJsonLd } from "@/components/seo/StructuredData";
import { ShieldCheck, Sparkles, Truck } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop Premium Mawa & Ghiya Barfi",
  description:
    "Order fresh Mawa Barfi and Ghiya Barfi online — premium, handcrafted mithai made with traditional recipes since 1950. Delivered across Delhi NCR.",
  alternates: { canonical: "/shop" },
};

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Home", url: "/" }, { name: "Shop", url: "/shop" }]} />
      <PageHeader
        eyebrow="The Shop"
        title="Our two signature sweets"
        subtitle="We make only what we can make perfectly. Choose your barfi — freshly prepared and packed with care for every order."
      />

      <section className="mx-auto max-w-6xl px-6 py-16">
        <ShopGrid products={products} />

        <div className="mx-auto mt-16 grid max-w-3xl gap-6 sm:grid-cols-3">
          <Assurance icon={Sparkles} title="Premium ingredients" body="Fresh milk, pure ghee, real nuts." />
          <Assurance icon={ShieldCheck} title="Hygienically packed" body="Spotless kitchen, careful packing." />
          <Assurance icon={Truck} title="Fresh delivery" body="Across Delhi NCR in 24–48 hrs." />
        </div>
      </section>
    </>
  );
}

function Assurance({
  icon: Icon,
  title,
  body,
}: {
  icon: React.ComponentType<{ size?: number }>;
  title: string;
  body: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-[var(--color-gold-light)] to-[var(--color-gold-deep)] text-[var(--color-maroon-deep)]">
        <Icon size={20} />
      </span>
      <p className="font-serif text-lg font-bold text-[var(--color-maroon)]">{title}</p>
      <p className="text-sm text-[var(--color-ink-soft)]">{body}</p>
    </div>
  );
}
