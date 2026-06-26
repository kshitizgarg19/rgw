import {
  Clock,
  Gem,
  HeartHandshake,
  History,
  ScrollText,
  ShieldCheck,
  Users,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";
import { WHY_CHOOSE } from "@/lib/constants";

const ICONS = [History, Users, Gem, Clock, ScrollText, ShieldCheck, HeartHandshake];

export function WhyChoose() {
  return (
    <section className="relative mx-auto max-w-7xl px-6 py-24">
      <SectionHeading
        eyebrow="Why RGW Sweets"
        title="Seventy-five years of doing it the right way"
        subtitle="No shortcuts, no substitutes — just the same honest craft, kept alive across four generations."
      />

      <Stagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" amount={0.1}>
        {WHY_CHOOSE.map((item, i) => {
          const Icon = ICONS[i % ICONS.length];
          const featured = i === 0;
          return (
            <StaggerItem key={item.title} className={featured ? "lg:col-span-1 sm:col-span-2" : ""}>
              <div className="group card-lux relative h-full overflow-hidden p-7 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_24px_60px_-20px_rgba(58,13,22,0.28)]">
                <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[var(--color-gold)]/10 transition-transform duration-700 group-hover:scale-150" />
                <div className="relative">
                  <span className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-gold-light)] to-[var(--color-gold-deep)] text-[var(--color-maroon-deep)] shadow-[0_6px_18px_-4px_rgba(196,154,63,0.5)]">
                    <Icon size={22} />
                  </span>
                  <h3 className="font-serif text-xl font-bold text-[var(--color-maroon)]">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-soft)]">{item.body}</p>
                </div>
              </div>
            </StaggerItem>
          );
        })}
        <StaggerItem className="sm:col-span-2 lg:col-span-2">
          <div className="card-lux flex h-full flex-col justify-center overflow-hidden bg-gradient-to-br from-[var(--color-maroon)] to-[var(--color-maroon-deep)] p-8 text-[var(--color-cream)]">
            <p className="font-serif text-3xl font-bold leading-tight">
              <span className="text-foil">Trusted by families</span> for over 75 years.
            </p>
            <p className="mt-3 max-w-md text-[var(--color-cream)]/75">
              From wedding boxes to festive thalis, generations have returned to RGW Sweets
              for the taste they grew up with. We&apos;d be honoured to be part of your moments too.
            </p>
          </div>
        </StaggerItem>
      </Stagger>
    </section>
  );
}
