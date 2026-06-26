"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Menu, Search, ShoppingBag, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { useCart } from "@/components/providers/CartProvider";
import { useWishlist } from "@/components/providers/WishlistProvider";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { SearchOverlay } from "./SearchOverlay";
import { WishlistMenu } from "./WishlistMenu";

export function Header() {
  const pathname = usePathname();
  const { count, openCart, setCartButton, bump } = useCart();
  const { count: wishCount } = useWishlist();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [wishOpen, setWishOpen] = useState(false);
  const cartBtnRef = useRef<HTMLButtonElement | null>(null);

  const isAdmin = pathname?.startsWith("/rgw-admin");
  const isHome = pathname === "/";
  // Light chrome only over the dark home hero (top of page).
  const light = isHome && !scrolled;

  useEffect(() => {
    setCartButton(cartBtnRef.current);
  }, [setCartButton]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setWishOpen(false);
  }, [pathname]);

  if (isAdmin) return null;

  return (
    <>
      <header className={cn("fixed inset-x-0 top-0 z-[120] transition-all duration-500", scrolled ? "py-2" : "py-4")}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div
            className={cn(
              "flex items-center justify-between gap-4 rounded-2xl px-4 py-2.5 transition-all duration-500 sm:px-5",
              scrolled ? "glass shadow-[0_8px_30px_rgba(44,10,17,0.12)]" : "bg-transparent"
            )}
          >
            <Logo light={light} />

            {/* Desktop nav */}
            <nav className="hidden items-center gap-1 lg:flex">
              {NAV_LINKS.map((l) => {
                const active = pathname === l.href;
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={cn(
                      "relative rounded-full px-4 py-2 text-sm font-medium transition-colors",
                      active
                        ? light
                          ? "text-[var(--color-cream)]"
                          : "text-[var(--color-maroon)]"
                        : light
                          ? "text-[var(--color-cream)]/75 hover:text-[var(--color-cream)]"
                          : "text-[var(--color-ink-soft)] hover:text-[var(--color-maroon)]"
                    )}
                  >
                    {l.label}
                    {active && <motion.span layoutId="nav-active" className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-[var(--color-gold)]" />}
                  </Link>
                );
              })}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              <IconButton label="Search" onClick={() => setSearchOpen(true)} light={light}>
                <Search size={19} />
              </IconButton>

              <div className="relative">
                <IconButton label="Wishlist" onClick={() => setWishOpen((v) => !v)} active={wishOpen} light={light}>
                  <Heart size={19} className={wishCount ? "fill-current" : ""} />
                  <Badge value={wishCount} />
                </IconButton>
                <WishlistMenu open={wishOpen} onClose={() => setWishOpen(false)} />
              </div>

              <button
                ref={cartBtnRef}
                onClick={openCart}
                aria-label="Open cart"
                className={cn(
                  "relative grid h-10 w-10 place-items-center rounded-full transition-colors",
                  light ? "text-[var(--color-cream)] hover:bg-white/10" : "text-[var(--color-maroon)] hover:bg-[var(--color-gold)]/15"
                )}
              >
                <motion.span key={bump} initial={{ scale: 1 }} animate={{ scale: [1, 1.35, 1] }} transition={{ duration: 0.45, ease: "easeOut" }} className="grid place-items-center">
                  <ShoppingBag size={20} />
                </motion.span>
                <Badge value={count} accent />
              </button>

              <button
                onClick={() => setMenuOpen((v) => !v)}
                aria-label="Menu"
                className={cn(
                  "grid h-10 w-10 place-items-center rounded-full transition-colors lg:hidden",
                  light ? "text-[var(--color-cream)] hover:bg-white/10" : "text-[var(--color-maroon)] hover:bg-[var(--color-gold)]/15"
                )}
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          <AnimatePresence>
            {menuOpen && (
              <motion.nav
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="glass mt-2 overflow-hidden rounded-2xl lg:hidden"
              >
                <ul className="flex flex-col p-2">
                  {NAV_LINKS.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className={cn(
                          "block rounded-xl px-4 py-3 text-base font-medium transition-colors",
                          pathname === l.href ? "bg-[var(--color-gold)]/15 text-[var(--color-maroon)]" : "text-[var(--color-ink-soft)] hover:bg-[var(--color-gold)]/10"
                        )}
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.nav>
            )}
          </AnimatePresence>
        </div>
      </header>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

function IconButton({
  children,
  label,
  onClick,
  active,
  light,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
  light?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={cn(
        "relative grid h-10 w-10 place-items-center rounded-full transition-colors",
        light ? "text-[var(--color-cream)] hover:bg-white/10" : "text-[var(--color-maroon)] hover:bg-[var(--color-gold)]/15",
        active && (light ? "bg-white/10" : "bg-[var(--color-gold)]/15")
      )}
    >
      {children}
    </button>
  );
}

function Badge({ value, accent }: { value: number; accent?: boolean }) {
  if (!value) return null;
  return (
    <span
      className={cn(
        "absolute -right-0.5 -top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full px-1 text-[10px] font-bold leading-none",
        accent ? "bg-[var(--color-gold)] text-[var(--color-maroon-deep)]" : "bg-[var(--color-maroon)] text-[var(--color-cream)]"
      )}
    >
      {value}
    </span>
  );
}
