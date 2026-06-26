import type { Metadata } from "next";
import { MapPin, Phone, MessageCircle, Mail, Clock, Truck } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { ContactForm } from "@/components/contact/ContactForm";
import { BUSINESS, whatsappLink } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Contact RGW Sweets — ${BUSINESS.address}. Call or WhatsApp ${BUSINESS.phone}. Fresh mithai delivered across ${BUSINESS.deliveryArea}.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(BUSINESS.mapsQuery)}&output=embed`;
  const directions = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(BUSINESS.mapsQuery)}`;

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="We'd love to hear from you"
        subtitle="Questions, bulk and festive orders, or just a craving — reach out and our family will help personally."
      />

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Info + form */}
          <div className="flex flex-col gap-6">
            <Reveal>
              <div className="grid gap-3 sm:grid-cols-2">
                <InfoCard icon={MapPin} title="Visit Us" lines={[BUSINESS.address]} href={directions} cta="Get directions" />
                <InfoCard icon={Phone} title="Call Us" lines={[BUSINESS.phone]} href={`tel:${BUSINESS.phoneDigits}`} cta="Tap to call" />
                <InfoCard icon={MessageCircle} title="WhatsApp" lines={[BUSINESS.whatsapp]} href={whatsappLink()} cta="Chat with us" external />
                <InfoCard icon={Mail} title="Email" lines={[BUSINESS.email]} href={`mailto:${BUSINESS.email}`} cta="Send email" />
                <InfoCard icon={Clock} title="Hours" lines={["Mon – Sun", "9:00 AM – 9:00 PM"]} />
                <InfoCard icon={Truck} title="Delivery" lines={[`Across ${BUSINESS.deliveryArea}`, "Fresh within 24–48 hrs"]} />
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="flex flex-wrap gap-3">
                <a href={`tel:${BUSINESS.phoneDigits}`} className="btn-gold">
                  <Phone size={18} /> Call Now
                </a>
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn-outline !border-[#1ba94c]/40 !text-[#1ba94c]">
                  <MessageCircle size={18} /> WhatsApp Chat
                </a>
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <ContactForm />
            </Reveal>
          </div>

          {/* Map */}
          <Reveal delay={0.1}>
            <div className="card-lux h-full min-h-[420px] overflow-hidden p-0">
              <iframe
                title="RGW Sweets location"
                src={mapSrc}
                className="h-full min-h-[420px] w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function InfoCard({
  icon: Icon,
  title,
  lines,
  href,
  cta,
  external,
}: {
  icon: React.ComponentType<{ size?: number }>;
  title: string;
  lines: string[];
  href?: string;
  cta?: string;
  external?: boolean;
}) {
  return (
    <div className="card-lux flex flex-col p-5">
      <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-gold-light)] to-[var(--color-gold-deep)] text-[var(--color-maroon-deep)]">
        <Icon size={18} />
      </span>
      <h3 className="font-serif text-lg font-bold text-[var(--color-maroon)]">{title}</h3>
      <div className="mt-1 text-sm text-[var(--color-ink-soft)]">
        {lines.map((l) => (
          <p key={l}>{l}</p>
        ))}
      </div>
      {href && cta && (
        <a
          href={href}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className="mt-3 inline-flex w-fit items-center gap-1 text-sm font-semibold text-[var(--color-gold-deep)] hover:underline"
        >
          {cta} →
        </a>
      )}
    </div>
  );
}
