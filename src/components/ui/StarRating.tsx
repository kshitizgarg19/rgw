"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

/** Read-only star display supporting fractional values. */
export function Stars({
  value,
  size = 16,
  className,
}: {
  value: number;
  size?: number;
  className?: string;
}) {
  return (
    <div className={cn("inline-flex items-center gap-0.5", className)} aria-label={`${value} out of 5`}>
      {[0, 1, 2, 3, 4].map((i) => {
        const fill = Math.max(0, Math.min(1, value - i));
        return (
          <span key={i} className="relative inline-block" style={{ width: size, height: size }}>
            <Star size={size} className="absolute inset-0 text-[var(--color-gold)]/35" fill="currentColor" />
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <Star size={size} className="text-[var(--color-gold)]" fill="currentColor" />
            </span>
          </span>
        );
      })}
    </div>
  );
}

/** Interactive star input for the review form. */
export function StarInput({
  value,
  onChange,
  size = 28,
}: {
  value: number;
  onChange: (v: number) => void;
  size?: number;
}) {
  const [hover, setHover] = useState(0);
  const shown = hover || value;
  return (
    <div className="inline-flex items-center gap-1" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          role="radio"
          aria-checked={value === i}
          aria-label={`${i} star${i > 1 ? "s" : ""}`}
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(i)}
          className="transition-transform duration-200 hover:scale-110"
        >
          <Star
            size={size}
            className={cn(
              "transition-colors",
              i <= shown ? "text-[var(--color-gold)]" : "text-[var(--color-ink)]/20"
            )}
            fill="currentColor"
          />
        </button>
      ))}
    </div>
  );
}
