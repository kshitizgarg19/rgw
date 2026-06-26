import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  light = false,
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: "center" | "left";
  light?: boolean;
  className?: string;
}) {
  return (
    <Reveal
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className
      )}
    >
      {eyebrow && (
        <div className={cn("flex items-center gap-3", align === "center" ? "justify-center" : "")}>
          <span className="h-px w-8 bg-[var(--color-gold)]" />
          <span className="eyebrow">{eyebrow}</span>
          {align === "center" && <span className="h-px w-8 bg-[var(--color-gold)]" />}
        </div>
      )}
      <h2
        className={cn(
          "max-w-3xl font-display text-5xl font-semibold leading-[1.04] tracking-[-0.01em] sm:text-6xl",
          light ? "text-[var(--color-cream)]" : "text-[var(--color-maroon)]"
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "max-w-2xl text-base leading-relaxed sm:text-lg",
            light ? "text-[var(--color-cream)]/75" : "text-[var(--color-ink-soft)]"
          )}
        >
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}
