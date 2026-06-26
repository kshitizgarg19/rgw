import { getProducts } from "@/lib/catalog";
import { requireAdmin } from "@/lib/auth";
import { ProductsManager } from "@/components/admin/ProductsManager";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const session = await requireAdmin();
  const products = await getProducts({ includeInactive: true });

  return (
    <div>
      <header className="mb-8">
        <h1 className="font-display text-4xl font-semibold text-[var(--color-maroon)]">Products</h1>
        <p className="mt-1 text-[var(--color-ink-soft)]">Manage your catalogue, prices, stock and imagery.</p>
      </header>
      <ProductsManager products={products} role={session.role} />
    </div>
  );
}
