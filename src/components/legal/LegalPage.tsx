import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";

export type LegalSection = { heading: string; paragraphs: string[] };

export function LegalPage({
  eyebrow,
  title,
  intro,
  sections,
  updated,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  sections: LegalSection[];
  updated: string;
}) {
  return (
    <>
      <PageHeader eyebrow={eyebrow} title={title} subtitle={intro} />
      <section className="mx-auto max-w-3xl px-6 py-16">
        <Reveal>
          <div className="card-lux flex flex-col gap-8 p-8 sm:p-10">
            {sections.map((s) => (
              <div key={s.heading}>
                <h2 className="font-serif text-2xl font-bold text-[var(--color-maroon)]">{s.heading}</h2>
                <div className="mt-3 flex flex-col gap-3 leading-relaxed text-[var(--color-ink-soft)]">
                  {s.paragraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>
            ))}
            <p className="border-t border-[var(--color-gold)]/20 pt-6 text-xs text-[var(--color-ink-faint)]">
              Last updated: {updated}
            </p>
          </div>
        </Reveal>
      </section>
    </>
  );
}
