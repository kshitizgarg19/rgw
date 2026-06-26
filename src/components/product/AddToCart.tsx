"use client";

import { useRouter } from "next/navigation";
import { ShoppingBag, Zap } from "lucide-react";
import { useCart } from "@/components/providers/CartProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { cartFields } from "@/lib/useProducts";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

export function AddToCartButton({
  product,
  quantity = 1,
  className,
  label = "Add to Cart",
  onAdded,
}: {
  product: Product;
  quantity?: number;
  className?: string;
  label?: string;
  onAdded?: () => void;
}) {
  const { addItem } = useCart();
  const { toast } = useToast();
  const soldOut = product.stock <= 0;

  return (
    <button
      disabled={soldOut}
      onClick={(e) => {
        addItem(cartFields(product), quantity, { x: e.clientX, y: e.clientY });
        toast(`${product.name}${quantity > 1 ? ` ×${quantity}` : ""} added to your box`);
        onAdded?.();
      }}
      className={cn(
        "btn-gold",
        soldOut && "pointer-events-none opacity-50",
        className
      )}
    >
      <ShoppingBag size={18} />
      {soldOut ? "Sold Out" : label}
    </button>
  );
}

export function BuyNowButton({
  product,
  quantity = 1,
  className,
  label = "Buy Now",
}: {
  product: Product;
  quantity?: number;
  className?: string;
  label?: string;
}) {
  const { addItem } = useCart();
  const router = useRouter();
  const soldOut = product.stock <= 0;

  return (
    <button
      disabled={soldOut}
      onClick={() => {
        addItem(cartFields(product), quantity);
        router.push("/checkout");
      }}
      className={cn("btn-outline", soldOut && "pointer-events-none opacity-50", className)}
    >
      <Zap size={18} />
      {label}
    </button>
  );
}
