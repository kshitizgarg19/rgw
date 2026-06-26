import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductShowcase } from "@/components/product/ProductShowcase";
import type { Product } from "@/lib/types";

export function FeaturedProducts({ products }: { products: Product[] }) {
  return (
    <section id="featured" className="relative mx-auto max-w-7xl scroll-mt-24 px-6 py-24">
      <SectionHeading
        eyebrow="The Display Counter"
        title="Two signature sweets, made to be remembered"
        subtitle="We make only what we can make perfectly. Each barfi is freshly prepared, hand-set, and packed with care."
      />
      <div className="mt-14 flex flex-col gap-10">
        {products.map((p, i) => (
          <ProductShowcase key={p.slug} product={p} index={i} />
        ))}
      </div>
    </section>
  );
}
