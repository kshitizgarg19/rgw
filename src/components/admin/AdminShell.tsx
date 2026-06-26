"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Cookie,
  ExternalLink,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Ticket,
  Users,
  X,
} from "lucide-react";
import { cn, initials } from "@/lib/utils";
import type { Session } from "@/lib/auth";

const NAV = [
  { label: "Dashboard", href: "/rgw-admin", icon: LayoutDashboard },
  { label: "Orders", href: "/rgw-admin/orders", icon: Package },
  { label: "Products", href: "/rgw-admin/products", icon: Cookie },
  { label: "Customers", href: "/rgw-admin/customers", icon: Users },
  { label: "Coupons", href: "/rgw-admin/coupons", icon: Ticket },
  { label: "Content", href: "/rgw-admin/content", icon: FileText },
];

export function AdminShell({ session, children }: { session: Session; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/rgw-admin-login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[var(--color-cream)] lg:pl-64">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-gradient-to-b from-[var(--color-espresso)] to-[var(--color-maroon-deep)] text-[var(--color-cream)] transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center gap-3 border-b border-[var(--color-gold)]/15 px-5 py-5">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--color-maroon-soft)] font-serif text-base font-bold text-[var(--color-gold-light)] ring-1 ring-[var(--color-gold)]/40">
            RGW
          </span>
          <div className="leading-none">
            <p className="font-serif text-lg font-bold">RGW Admin</p>
            <p className="mt-0.5 text-[0.6rem] uppercase tracking-[0.2em] text-[var(--color-gold-light)]/70">Since 1950</p>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-3">
          {NAV.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-[var(--color-gold)]/20 text-[var(--color-gold-light)]"
                    : "text-[var(--color-cream)]/70 hover:bg-white/5 hover:text-[var(--color-cream)]"
                )}
              >
                <Icon size={18} /> {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-[var(--color-gold)]/15 p-3">
          <Link href="/" target="_blank" className="mb-2 flex items-center gap-2 rounded-xl px-4 py-2 text-sm text-[var(--color-cream)]/60 transition-colors hover:text-[var(--color-gold-light)]">
            <ExternalLink size={16} /> View site
          </Link>
          <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[var(--color-gold)] text-sm font-bold text-[var(--color-maroon-deep)]">
              {initials(session.name)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{session.name}</p>
              <p className="text-[0.65rem] uppercase tracking-wide text-[var(--color-gold-light)]/70">
                {session.role === "SUPER_ADMIN" ? "Super Admin" : "Staff Admin"}
              </p>
            </div>
            <button onClick={logout} aria-label="Log out" className="text-[var(--color-cream)]/60 transition-colors hover:text-[var(--color-gold-light)]">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile backdrop */}
      {open && <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setOpen(false)} />}

      {/* Mobile topbar */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-[var(--color-gold)]/20 bg-[var(--color-cream)]/90 px-4 py-3 backdrop-blur lg:hidden">
        <button onClick={() => setOpen(true)} aria-label="Open menu" className="text-[var(--color-maroon)]">
          <Menu size={22} />
        </button>
        <span className="font-serif text-lg font-bold text-[var(--color-maroon)]">RGW Admin</span>
        <button onClick={logout} aria-label="Log out" className="text-[var(--color-maroon)]">
          <LogOut size={20} />
        </button>
      </div>

      <main className="mx-auto max-w-6xl p-5 sm:p-8">{children}</main>
    </div>
  );
}
