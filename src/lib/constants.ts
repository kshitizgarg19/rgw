/* ============================================================================
   RGW SWEETS — single source of truth for business + catalog constants.
   ========================================================================== */

export const BUSINESS = {
  name: "RGW Sweets",
  brandLine: "Rajender Mittal · Gajar Pak Wale",
  tagline: "Traditional Mithai Since 1950",
  estYear: 1950,
  yearsOfHeritage: new Date().getFullYear() - 1950, // 75+
  phone: "+91 7404324707",
  phoneDigits: "917404324707",
  whatsapp: "+91 7404324707",
  whatsappDigits: "917404324707",
  whatsappDefaultMessage: "Hello RGW Sweets, I would like to know more about your sweets.",
  email: "orders@rgwsweets.in",
  address: "Old Gur Mandi, Samalkha, Haryana, India",
  addressShort: "Old Gur Mandi, Samalkha, Haryana",
  deliveryArea: "Delhi NCR",
  mapsQuery: "Old Gur Mandi, Samalkha, Haryana, India",
} as const;

export const SITE = {
  url: "https://rgwsweets.in",
  defaultTitle: "RGW Sweets — Premium Mawa & Ghiya Barfi | Traditional Mithai Since 1950",
  defaultDescription:
    "Buy fresh, premium Mawa Barfi and Ghiya Barfi online. Authentic Indian mithai handcrafted with traditional family recipes since 1950. Freshly prepared, hygienically packed, delivered across Delhi NCR.",
  keywords: [
    "Mawa Barfi Online",
    "Ghiya Barfi Online",
    "Premium Mithai",
    "Traditional Indian Sweets",
    "Fresh Mithai Delhi NCR",
    "Buy Mithai Online",
    "RGW Sweets",
  ],
} as const;

/** Delivery defaults (admin-editable via SiteContent). */
export const DELIVERY = {
  charge: 49,
  freeAbove: 1500,
  etaText: "Delivered fresh across Delhi NCR within 24–48 hours.",
} as const;

export function whatsappLink(message: string = BUSINESS.whatsappDefaultMessage) {
  return `https://wa.me/${BUSINESS.whatsappDigits}?text=${encodeURIComponent(message)}`;
}

/** httpOnly session cookie name for the admin panel. */
export const ADMIN_COOKIE = "rgw_admin_session";

export const ORDER_STATUSES = ["NEW", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"] as const;

/* ----------------------------------------------------------------------------
   Catalog — canonical product definitions (used to seed the DB + SEO fallback).
   Image paths point at placeholder SVGs in /public/products; replace those
   files with real photography (same filename) or update via the admin panel.
   -------------------------------------------------------------------------- */
export type ProductSeed = {
  slug: string;
  name: string;
  tagline: string;
  price: number;
  weight: string;
  accent: "mawa" | "pistachio";
  shortDescription: string;
  description: string;
  story: string;
  ingredients: string[];
  notes: string[];
  images: string[];
};

export const PRODUCTS: ProductSeed[] = [
  {
    slug: "mawa-barfi",
    name: "Mawa Barfi",
    tagline: "The classic. Pure khoya, slow-set.",
    price: 750,
    weight: "1 Kg",
    accent: "mawa",
    shortDescription:
      "Rich, melt-in-the-mouth mawa barfi made from premium milk khoya and a whisper of cardamom.",
    description:
      "Rich and authentic mawa barfi prepared using premium quality milk and traditional family recipes. Freshly prepared and hygienically packed. Each piece is slow-cooked, hand-set, and finished with a delicate garnish.",
    story:
      "Our Mawa Barfi begins before sunrise, when fresh milk is reduced for hours in heavy iron kadhais until it becomes velvety khoya. It is the recipe our family has made since 1950 — unchanged, unhurried, and never compromised.",
    ingredients: [
      "Fresh milk khoya (mawa)",
      "Pure cane sugar",
      "Green cardamom",
      "Desi ghee",
      "Pistachio & almond slivers",
    ],
    notes: [
      "No artificial colours or preservatives",
      "Freshly prepared on order",
      "Best enjoyed within 5–7 days, refrigerated",
    ],
    images: ["/products/mawa-barfi.jpg", "/products/mawa-barfi-tray.jpg"],
  },
  {
    slug: "ghiya-barfi",
    name: "Ghiya Barfi",
    tagline: "Heirloom recipe. Fresh bottle gourd, gently set.",
    price: 750,
    weight: "1 Kg",
    accent: "pistachio",
    shortDescription:
      "A delicate, fragrant barfi of fresh bottle gourd slow-cooked with milk — soft, light, and quietly luxurious.",
    description:
      "Traditional ghiya barfi prepared using fresh bottle gourd, premium milk, and authentic recipes passed down through generations. Subtly sweet, beautifully soft, and naturally pale green.",
    story:
      "Ghiya Barfi is the sweet our elders made for festivals — fresh bottle gourd grated by hand, simmered slowly with milk and ghee until it turns tender and aromatic. Few halwais still make it the proper way. We do.",
    ingredients: [
      "Fresh bottle gourd (ghiya / lauki)",
      "Premium full-cream milk",
      "Pure cane sugar",
      "Desi ghee",
      "Green cardamom & pistachio",
    ],
    notes: [
      "Made with hand-grated fresh ghiya",
      "Naturally pale green — no added colour",
      "Best enjoyed within 4–5 days, refrigerated",
    ],
    images: ["/products/ghiya-barfi.jpg", "/products/ghiya-barfi-tray.jpg"],
  },
];

export const WHY_CHOOSE = [
  { title: "Established Since 1950", body: "Three-quarters of a century of unbroken sweet-making tradition." },
  { title: "Fourth Generation", body: "The same family, the same hands, the same uncompromising recipes." },
  { title: "Premium Ingredients", body: "Fresh milk, pure ghee, real nuts — nothing artificial, ever." },
  { title: "Freshly Prepared", body: "Made to order in small batches, never mass-produced or stored long." },
  { title: "Traditional Recipes", body: "Slow-cooked the old way, exactly as four generations have done." },
  { title: "Hygienic Manufacturing", body: "Spotless kitchens and careful, hygienic packing for every box." },
  { title: "Trusted for 75+ Years", body: "Generations of families return to us for life's sweetest moments." },
];

export const FAQS = [
  {
    q: "How fresh are the sweets?",
    a: "Every box is freshly prepared in small batches once you order — never pre-made and stored. Mawa Barfi is best within 5–7 days and Ghiya Barfi within 4–5 days, kept refrigerated.",
  },
  {
    q: "Where do you deliver?",
    a: "We currently deliver across Delhi NCR, freshly packed and usually within 24–48 hours of preparation.",
  },
  {
    q: "What ingredients do you use?",
    a: "Only premium ingredients — fresh milk khoya, pure cane sugar, desi ghee, real cardamom and nuts. No artificial colours or preservatives. Ghiya Barfi's pale green is entirely natural.",
  },
  {
    q: "How do I place an order?",
    a: "Add your sweets to the cart and check out with your delivery details. You can also message us on WhatsApp and we'll take care of the rest.",
  },
  {
    q: "How can I pay?",
    a: "Online payment is coming soon. For now, place your order on the site and our team will confirm it with you over WhatsApp to arrange delivery and payment.",
  },
];

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Our Story", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const FOOTER_POLICIES = [
  { label: "Shipping Policy", href: "/shipping-policy" },
  { label: "Refund Policy", href: "/refund-policy" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms" },
];
