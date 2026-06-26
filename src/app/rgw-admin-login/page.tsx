import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { LoginForm } from "@/components/admin/LoginForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const session = await getSession();
  if (session) redirect("/rgw-admin");

  return (
    <div className="dark-panel relative grid min-h-screen place-items-center px-6">
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[50vh] w-[50vw] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(242,181,74,0.18),transparent_60%)] blur-2xl" />
      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <span className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-[var(--color-maroon-soft)] to-[var(--color-maroon-deep)] font-serif text-2xl font-bold text-[var(--color-gold-light)] ring-1 ring-[var(--color-gold)]/40">
            RGW
          </span>
          <h1 className="font-display text-4xl font-semibold text-[var(--color-cream)]">Admin Panel</h1>
          <p className="mt-2 text-sm text-[var(--color-cream)]/60">RGW Sweets — staff access only</p>
        </div>

        <div className="rounded-2xl border border-[var(--color-gold)]/25 bg-[var(--color-espresso)]/40 p-7 backdrop-blur">
          <LoginForm />
        </div>

        <p className="mt-6 text-center text-xs text-[var(--color-cream)]/40">
          Protected area · Unauthorized access prohibited
        </p>
      </div>
    </div>
  );
}
