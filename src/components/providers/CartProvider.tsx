"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { CartItem, AppliedCoupon } from "@/lib/types";

type AddInput = Omit<CartItem, "quantity">;

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  discount: number;
  coupon: AppliedCoupon | null;
  couponError: string | null;
  hydrated: boolean;
  addItem: (item: AddInput, qty?: number, origin?: { x: number; y: number }) => void;
  removeItem: (slug: string) => void;
  setQty: (slug: string, qty: number) => void;
  clear: () => void;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
  // drawer
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  // badge bump + fly target
  bump: number;
  setCartButton: (el: HTMLElement | null) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const CART_KEY = "rgw_cart_v1";
const COUPON_KEY = "rgw_coupon_v1";

type Fly = { id: number; from: { x: number; y: number }; to: { x: number; y: number }; color: string };

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [coupon, setCoupon] = useState<AppliedCoupon | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [bump, setBump] = useState(0);
  const [flies, setFlies] = useState<Fly[]>([]);

  const cartButtonRef = useRef<HTMLElement | null>(null);
  const flyId = useRef(0);

  // Hydrate from localStorage once on mount.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(CART_KEY);
      if (raw) setItems(JSON.parse(raw));
      const c = localStorage.getItem(COUPON_KEY);
      if (c) setCoupon(JSON.parse(c));
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  // Persist.
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    if (coupon) localStorage.setItem(COUPON_KEY, JSON.stringify(coupon));
    else localStorage.removeItem(COUPON_KEY);
  }, [coupon, hydrated]);

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items]
  );

  const count = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  );

  const discount = useMemo(() => {
    if (!coupon) return 0;
    if (subtotal <= 0) return 0;
    const d =
      coupon.type === "PERCENT"
        ? Math.round((subtotal * coupon.value) / 100)
        : coupon.value;
    return Math.min(d, subtotal);
  }, [coupon, subtotal]);

  const setCartButton = useCallback((el: HTMLElement | null) => {
    cartButtonRef.current = el;
  }, []);

  const spawnFly = useCallback((origin: { x: number; y: number }, color: string) => {
    const target = cartButtonRef.current?.getBoundingClientRect();
    if (!target) {
      setBump((b) => b + 1);
      return;
    }
    const to = { x: target.left + target.width / 2, y: target.top + target.height / 2 };
    const id = ++flyId.current;
    setFlies((f) => [...f, { id, from: origin, to, color }]);
  }, []);

  const addItem = useCallback<CartContextValue["addItem"]>(
    (item, qty = 1, origin) => {
      setItems((prev) => {
        const existing = prev.find((i) => i.slug === item.slug);
        if (existing) {
          return prev.map((i) =>
            i.slug === item.slug ? { ...i, quantity: i.quantity + qty } : i
          );
        }
        return [...prev, { ...item, quantity: qty }];
      });
      const color = item.accent === "pistachio" ? "#9fb86a" : "#dcab6e";
      if (origin) spawnFly(origin, color);
      else setBump((b) => b + 1);
    },
    [spawnFly]
  );

  const removeItem = useCallback((slug: string) => {
    setItems((prev) => prev.filter((i) => i.slug !== slug));
  }, []);

  const setQty = useCallback((slug: string, qty: number) => {
    setItems((prev) =>
      prev
        .map((i) => (i.slug === slug ? { ...i, quantity: Math.max(0, qty) } : i))
        .filter((i) => i.quantity > 0)
    );
  }, []);

  const clear = useCallback(() => {
    setItems([]);
    setCoupon(null);
    setCouponError(null);
  }, []);

  const applyCoupon = useCallback(
    async (code: string): Promise<boolean> => {
      setCouponError(null);
      try {
        const res = await fetch("/api/coupons/validate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code, subtotal }),
        });
        const data = await res.json();
        if (!res.ok || !data.valid) {
          setCoupon(null);
          setCouponError(data.error || "Invalid coupon code.");
          return false;
        }
        setCoupon(data.coupon as AppliedCoupon);
        return true;
      } catch {
        setCouponError("Could not validate coupon. Please try again.");
        return false;
      }
    },
    [subtotal]
  );

  const removeCoupon = useCallback(() => {
    setCoupon(null);
    setCouponError(null);
  }, []);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const value: CartContextValue = {
    items,
    count,
    subtotal,
    discount,
    coupon,
    couponError,
    hydrated,
    addItem,
    removeItem,
    setQty,
    clear,
    applyCoupon,
    removeCoupon,
    isOpen,
    openCart,
    closeCart,
    bump,
    setCartButton,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
      {/* Fly-to-cart layer */}
      <div className="pointer-events-none fixed inset-0 z-[200]">
        <AnimatePresence>
          {flies.map((fly) => (
            <motion.span
              key={fly.id}
              initial={{ x: fly.from.x - 18, y: fly.from.y - 18, scale: 1, opacity: 1 }}
              animate={{
                x: fly.to.x - 18,
                y: fly.to.y - 18,
                scale: 0.3,
                opacity: 0.9,
              }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              onAnimationComplete={() => {
                setFlies((f) => f.filter((x) => x.id !== fly.id));
                setBump((b) => b + 1);
              }}
              className="absolute left-0 top-0 h-9 w-9 rounded-lg shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${fly.color}, color-mix(in srgb, ${fly.color} 60%, #7c2236))`,
                boxShadow: "0 8px 20px rgba(58,13,22,0.35)",
              }}
            />
          ))}
        </AnimatePresence>
      </div>
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
