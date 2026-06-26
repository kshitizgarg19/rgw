"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed.");
        setBusy(false);
        return;
      }
      router.push("/rgw-admin");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-[var(--color-cream)]/80">Email</span>
        <div className="relative">
          <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-gold)]/70" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            placeholder="admin@rgwsweets.in"
            className="w-full rounded-xl border border-[var(--color-gold)]/30 bg-[var(--color-espresso)]/60 py-3 pl-11 pr-4 text-[var(--color-cream)] placeholder:text-[var(--color-cream)]/30 outline-none transition-colors focus:border-[var(--color-gold)]"
          />
        </div>
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-[var(--color-cream)]/80">Password</span>
        <div className="relative">
          <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-gold)]/70" />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            placeholder="••••••••"
            className="w-full rounded-xl border border-[var(--color-gold)]/30 bg-[var(--color-espresso)]/60 py-3 pl-11 pr-4 text-[var(--color-cream)] placeholder:text-[var(--color-cream)]/30 outline-none transition-colors focus:border-[var(--color-gold)]"
          />
        </div>
      </label>

      {error && (
        <p className="rounded-lg bg-[var(--color-maroon-soft)]/30 px-4 py-2.5 text-sm text-[var(--color-gold-light)]">
          {error}
        </p>
      )}

      <button type="submit" disabled={busy} className="btn-gold mt-2 w-full justify-center disabled:opacity-60">
        {busy ? "Signing in…" : "Sign In"}
      </button>
    </form>
  );
}
