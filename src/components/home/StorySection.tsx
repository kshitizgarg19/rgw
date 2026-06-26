import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { BUSINESS } from "@/lib/constants";

export function StorySection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[var(--color-parchment)] to-[var(--color-cream)] py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-2">
        {/* Layered imagery — depth */}
        <Reveal className="relative">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md">
            {/* back card */}
            <div className="absolute -left-4 top-6 h-[88%] w-[78%] rotate-[-6deg] rounded-3xl bg-gradient-to-br from-[var(--color-maroon)] to-[var(--color-maroon-deep)] shadow-lift" />
            {/* mid image */}
            <div className="absolute right-0 top-0 h-[80%] w-[78%] overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--color-espresso)] to-[var(--color-maroon-deep)] ring-1 ring-[var(--color-gold)]/30 shadow-lift">
              <div className="absolute inset-0 spotlight" />
              <Image src="/products/mawa-barfi-tray.jpg" alt="A tray of fresh Mawa Barfi" fill sizes="(max-width:1024px) 90vw, 40vw" className="object-cover" />
            </div>
            {/* foreground badge */}
            <div className="absolute -bottom-2 left-2 flex items-center gap-3 rounded-2xl bg-[var(--color-ivory)] px-5 py-4 shadow-lift ring-1 ring-[var(--color-gold)]/30">
              <span className="font-serif text-4xl font-bold text-foil">{BUSINESS.yearsOfHeritage}+</span>
              <span className="text-sm font-medium leading-tight text-[var(--color-ink-soft)]">
                years of <br /> family tradition
              </span>
            </div>
          </div>
        </Reveal>

        {/* Copy */}
        <div>
          <Reveal>
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-8 bg-[var(--color-gold)]" />
              <span className="eyebrow">Our Story</span>
            </div>
            <h2 className="font-serif text-4xl font-bold leading-tight text-[var(--color-maroon)] sm:text-5xl">
              A family kitchen that never stopped
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-6 space-y-4 text-[var(--color-ink-soft)]">
              <p className="leading-relaxed">
                RGW Sweets began in {BUSINESS.estYear} in the lanes of Old Gur Mandi, Samalkha — a
                small counter, a heavy iron kadhai, and a family that believed sweets should be made
                with patience and pure ingredients, never rushed.
              </p>
              <p className="leading-relaxed">
                Four generations later, very little has changed. We still reduce fresh milk by hand,
                still grate ghiya the slow way, and still refuse anything artificial. It is the only way
                we know — and the reason families have trusted us for over seventy-five years.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/about" className="btn-gold">Read Our Heritage</Link>
              <Link href="/shop" className="btn-outline">Taste the Tradition</Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
