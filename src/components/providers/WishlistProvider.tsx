"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type WishlistValue = {
  items: string[]; // product slugs
  has: (slug: string) => boolean;
  toggle: (slug: string) => void;
  count: number;
  hydrated: boolean;
};

const WishlistContext = createContext<WishlistValue | null>(null);
const KEY = "rgw_wishlist_v1";

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const has = useCallback((slug: string) => items.includes(slug), [items]);
  const toggle = useCallback((slug: string) => {
    setItems((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  }, []);

  return (
    <WishlistContext.Provider
      value={{ items, has, toggle, count: items.length, hydrated }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
