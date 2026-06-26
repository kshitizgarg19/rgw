"use client";

import { usePathname } from "next/navigation";

/** Renders children everywhere except the admin section. */
export function HideOnAdmin({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/rgw-admin")) return null;
  return <>{children}</>;
}
