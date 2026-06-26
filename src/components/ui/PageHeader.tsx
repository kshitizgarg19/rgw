import { Reveal } from "@/components/ui/Reveal";

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-[var(--color-gold)]/15 bg-gradient-to-b from-[var(--color-parchment)] to-[var(--color-cream)] px-6 pb-12 pt-36">
      <div className="mx-auto max-w-4xl text-center">
        <Reveal>
          {eyebrow && (
            <div className="mb-4 flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-[var(--color-gold)]" />
              <span className="eyebrow">{eyebrow}</span>
              <span className="h-px w-8 bg-[var(--color-gold)]" />
            </div>
          )}
          <h1 className="font-display text-5xl font-semibold leading-[1.03] tracking-[-0.01em] text-[var(--color-maroon)] sm:text-6xl md:text-7xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-[var(--color-ink-soft)]">
              {subtitle}
            </p>
          )}
          {children}
        </Reveal>
      </div>
    </section>
  );
}
