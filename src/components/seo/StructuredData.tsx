import { BUSINESS, SITE } from "@/lib/constants";
import type { Product } from "@/lib/types";

function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

export function LocalBusinessJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": ["Store", "LocalBusiness", "FoodEstablishment"],
        "@id": `${SITE.url}/#business`,
        name: BUSINESS.name,
        description: SITE.defaultDescription,
        url: SITE.url,
        telephone: BUSINESS.phone,
        foundingDate: "1950",
        priceRange: "₹₹",
        image: `${SITE.url}/brand/rgw-logo.svg`,
        address: {
          "@type": "PostalAddress",
          streetAddress: "Old Gur Mandi",
          addressLocality: "Samalkha",
          addressRegion: "Haryana",
          addressCountry: "IN",
        },
        areaServed: BUSINESS.deliveryArea,
        servesCuisine: "Indian Sweets / Mithai",
      }}
    />
  );
}

export function WebsiteJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: BUSINESS.name,
        url: SITE.url,
      }}
    />
  );
}

export function ProductJsonLd({ product }: { product: Product }) {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: `${SITE.url}${product.images[0]}`,
    brand: { "@type": "Brand", name: BUSINESS.name },
    category: "Indian Sweets",
    offers: {
      "@type": "Offer",
      url: `${SITE.url}/product/${product.slug}`,
      priceCurrency: "INR",
      price: product.price,
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
  };
  if (product.ratingCount > 0) {
    data.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: product.ratingAvg.toFixed(1),
      reviewCount: product.ratingCount,
    };
  }
  return <JsonLd data={data} />;
}

export function BreadcrumbJsonLd({ items }: { items: { name: string; url: string }[] }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((it, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: it.name,
          item: `${SITE.url}${it.url}`,
        })),
      }}
    />
  );
}
