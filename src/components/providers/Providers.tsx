"use client";

import { SmoothScroll } from "./SmoothScroll";
import { ToastProvider } from "./ToastProvider";
import { WishlistProvider } from "./WishlistProvider";
import { CartProvider } from "./CartProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SmoothScroll>
      <ToastProvider>
        <WishlistProvider>
          <CartProvider>{children}</CartProvider>
        </WishlistProvider>
      </ToastProvider>
    </SmoothScroll>
  );
}
