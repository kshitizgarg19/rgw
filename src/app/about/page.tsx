import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Award, HeartHandshake, Leaf, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { BUSINESS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "RGW Sweets — a fourth-generation family mithai business handcrafting authentic Mawa and Ghiya Barfi in Samalkha since 1950.",
  alternates: { canonical: "/about" },
};

const MILESTONES = [
  { year: "1950", title: "Where it began", body: "A small counter in Old Gur Mandi, Samalkha — one family, one heavy iron kadhai, and a belief that sweets should never be rushed." },
  { year: "1970s", title: "A name to trust", body: "Word spread. Families began returning for festivals, weddings and everyday joys — drawn by taste that never changed." },
  { year: "Today", title: "Four generations on", body: "The same recipes, the same hands-on craft, now brought online so you can enjoy our mithai wherever you are in Delhi NCR." },
];

const VALUES = [
  { icon: Leaf, title: "Pure ingredients", body: "Fresh milk, real ghee, genuine nuts — never anything artificial." },
  { icon: Sparkles, title: "Made fresh", body: "Small batches, prepared once you order — never mass-produced." },
  { icon: Award, title: "Time-honoured craft", body: "Slow-cooked the traditional way, exactly as in 1950." },
  { icon: HeartHandshake, title: "Family trust", body: "Three-quarters of a century of families coming back for more." },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Our Story"
        title="A family kitchen that never stopped"
        subtitle={`Four generations of authentic mithai, handcrafted in Samalkha since ${BUSINESS.estYear}.`}
      />

      {/* Intro */}
      <section className="mx-auto grid max-w-6xl items-center gap-14 px-6 py-16 lg:grid-cols-2">
        <Reveal className="relative">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md">
            <div className="absolute -left-4 top-6 h-[88%] w-[78%] rotate-[-6deg] rounded-3xl bg-gradient-to-br from-[var(--color-maroon)] to-[var(--color-maroon-deep)] shadow-lift" />
            <div className="absolute right-0 top-0 h-[82%] w-[78%] overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--color-espresso)] to-[var(--color-maroon-deep)] ring-1 ring-[var(--color-gold)]/30 shadow-lift">
              <div className="absolute inset-0 spotlight" />
              <Image src="/products/ghiya-barfi-tray.jpg" alt="A tray of fresh Ghiya Barfi" fill sizes="(max-width:1024px) 90vw, 40vw" className="object-cover" />
            </div>
            <div className="absolute -bottom-2 left-2 flex items-center gap-3 rounded-2xl bg-[var(--color-ivory)] px-5 py-4 shadow-lift ring-1 ring-[var(--color-gold)]/30">
              <span className="font-display text-4xl font-semibold text-foil">{BUSINESS.yearsOfHeritage}+</span>
              <span className="text-sm font-medium leading-tight text-[var(--color-ink-soft)]">years of <br /> family tradition</span>
            </div>
          </div>
        </Reveal>

        <div>
          <Reveal>
            <div className="flex flex-col gap-4 text-[var(--color-ink-soft)]">
              <p className="leading-relaxed">
                RGW Sweets — known to generations by the family name <span className="font-medium text-[var(--color-maroon)]">{BUSINESS.brandLine}</span> — began in {BUSINESS.estYear} in the bustling lanes of Old Gur Mandi, Samalkha.
              </p>
              <p className="leading-relaxed">
                What started as a modest sweet counter grew into a name families trust for life&apos;s sweetest moments. Through four generations, our promise has stayed exactly the same: real ingredients, traditional methods, and the patience to do things properly.
              </p>
              <p className="leading-relaxed">
                We still reduce fresh milk by hand for our Mawa Barfi. We still grate ghiya the slow way. We still refuse shortcuts. It is the only way we know — and the reason our sweets taste the way they did seventy-five years ago.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Milestones */}
      <section className="mx-auto max-w-5xl px-6 py-12">
        <SectionHeading eyebrow="The Journey" title="Seventy-five years, unhurried" />
        <Stagger className="mt-12 grid gap-6 md:grid-cols-3" amount={0.1}>
          {MILESTONES.map((m) => (
            <StaggerItem key={m.year}>
              <div className="card-lux h-full p-7">
                <span className="font-display text-4xl font-semibold text-foil">{m.year}</span>
                <h3 className="mt-3 font-serif text-xl font-bold text-[var(--color-maroon)]">{m.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-soft)]">{m.body}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <SectionHeading eyebrow="What We Believe" title="The craft behind every piece" />
        <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" amount={0.1}>
          {VALUES.map((v) => {
            const Icon = v.icon;
            return (
              <StaggerItem key={v.title}>
                <div className="card-lux h-full p-6 text-center">
                  <span className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-gold-light)] to-[var(--color-gold-deep)] text-[var(--color-maroon-deep)]">
                    <Icon size={20} />
                  </span>
                  <h3 className="font-serif text-lg font-bold text-[var(--color-maroon)]">{v.title}</h3>
                  <p className="mt-1.5 text-sm text-[var(--color-ink-soft)]">{v.body}</p>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>
      </section>

      {/* Promise band */}
      <section className="dark-panel relative my-12 overflow-hidden py-20">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[40vh] w-[60vw] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(242,181,74,0.18),transparent_60%)] blur-2xl" />
        <Reveal className="relative mx-auto max-w-2xl px-6 text-center">
          <p className="font-display text-3xl font-medium leading-snug text-[var(--color-cream)] sm:text-4xl">
            &ldquo;We don&apos;t make sweets to sell.
            <br />
            We make them the way we&apos;d make them <span className="text-foil italic">for our own family.</span>&rdquo;
          </p>
          <p className="mt-6 text-sm uppercase tracking-[0.25em] text-[var(--color-gold-light)]">The Mittal Family</p>
        </Reveal>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-3xl px-6 pb-8 text-center">
        <Reveal>
          <h2 className="font-display text-4xl font-semibold text-[var(--color-maroon)]">Taste the tradition</h2>
          <p className="mx-auto mt-3 max-w-md text-[var(--color-ink-soft)]">
            Two signature barfis, freshly made and delivered across {BUSINESS.deliveryArea}.
          </p>
          <Link href="/shop" className="btn-gold mt-6">Shop Our Sweets</Link>
        </Reveal>
      </section>
    </>
  );
}
