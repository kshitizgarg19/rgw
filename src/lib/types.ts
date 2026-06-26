/** App-facing types (DB rows are mapped into these with arrays parsed). */

export type Product = {
  id: string;
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
  ratingAvg: number;
  ratingCount: number;
  stock: number;
  active: boolean;
  sortOrder: number;
};

export type CartItem = {
  slug: string;
  name: string;
  price: number;
  weight: string;
  image: string;
  accent: "mawa" | "pistachio";
  quantity: number;
};

export type ReviewItem = {
  id: string;
  productSlug: string | null;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export type OrderStatus =
  | "NEW"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export type PaymentStatus = "PENDING" | "PAID" | "FAILED";

export type AdminRole = "SUPER_ADMIN" | "STAFF_ADMIN";

export type AppliedCoupon = {
  code: string;
  type: "PERCENT" | "FIXED";
  value: number;
  discount: number;
};
