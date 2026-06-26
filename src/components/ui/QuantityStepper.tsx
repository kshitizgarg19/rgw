"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  size = "md",
  className,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
  className?: string;
}) {
  const dim = size === "sm" ? "h-8 w-8" : "h-11 w-11";
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-[var(--color-gold)]/40 bg-[var(--color-ivory)] p-1",
        className
      )}
    >
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className={cn(dim, "grid place-items-center rounded-full text-[var(--color-maroon)] transition-colors hover:bg-[var(--color-gold)]/20 disabled:opacity-40")}
      >
        <Minus size={size === "sm" ? 14 : 16} />
      </button>
      <span className={cn("text-center font-semibold text-[var(--color-ink)]", size === "sm" ? "w-7 text-sm" : "w-10 text-lg")}>
        {value}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className={cn(dim, "grid place-items-center rounded-full text-[var(--color-maroon)] transition-colors hover:bg-[var(--color-gold)]/20 disabled:opacity-40")}
      >
        <Plus size={size === "sm" ? 14 : 16} />
      </button>
    </div>
  );
}
