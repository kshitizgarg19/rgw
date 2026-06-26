import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/** Brand lockup: real logo on a clean white badge + optional wordmark. */
export function Logo({
  className,
  light = false,
  withWordmark = true,
}: {
  className?: string;
  light?: boolean;
  withWordmark?: boolean;
}) {
  return (
    <Link href="/" className={cn("group flex items-center gap-3", className)} aria-label="RGW Sweets — home">
      <span className="inline-flex items-center justify-center rounded-xl bg-white px-2 py-1.5 shadow-sm ring-1 ring-[var(--color-gold)]/35 transition-transform duration-500 group-hover:scale-105">
        <Image
          src="/brand/rgw-logo.png"
          alt="Rajender Mittal — Gajar Pak Wale"
          width={1234}
          height={838}
          priority
          className="h-11 w-auto object-contain md:h-[52px]"
        />
      </span>
      {withWordmark && (
        <span className="hidden flex-col leading-none sm:flex">
          <span className={cn("font-serif text-xl font-bold tracking-tight", light ? "text-[var(--color-cream)]" : "text-[var(--color-maroon)]")}>
            RGW Sweets
          </span>
          <span className={cn("mt-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.28em]", light ? "text-[var(--color-gold-light)]" : "text-[var(--color-gold-deep)]")}>
            Since 1950
          </span>
        </span>
      )}
    </Link>
  );
}

/** Larger standalone logo on a white badge. */
export function LogoBadge({ className, size = 200 }: { className?: string; size?: number }) {
  return (
    <span className={cn("inline-block rounded-2xl bg-white p-2 shadow-lg", className)}>
      <Image src="/brand/rgw-logo.png" alt="Rajender Mittal — Gajar Pak Wale" width={1234} height={838} className="h-auto object-contain" style={{ width: size }} />
    </span>
  );
}
