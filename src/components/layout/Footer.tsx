import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, MessageCircle, Mail } from "lucide-react";
import { BUSINESS, NAV_LINKS, FOOTER_POLICIES, whatsappLink } from "@/lib/constants";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-24 overflow-hidden bg-gradient-to-b from-[var(--color-maroon)] to-[var(--color-maroon-deep)] text-[var(--color-cream)]">
      {/* gold top hairline */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent" />

      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3">
            <span className="inline-flex shrink-0 items-center justify-center rounded-xl bg-white px-2.5 py-2 shadow ring-1 ring-[var(--color-gold)]/40">
              <Image
                src="/brand/rgw-logo.png"
                alt="Rajender Mittal — Gajar Pak Wale"
                width={1234}
                height={838}
                className="h-12 w-auto object-contain"
              />
            </span>
            <div className="leading-none">
              <p className="font-serif text-xl font-bold">RGW Sweets</p>
              <p className="mt-1 text-[0.62rem] uppercase tracking-[0.28em] text-[var(--color-gold-light)]">
                {BUSINESS.tagline}
              </p>
            </div>
          </div>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-[var(--color-cream)]/70">
            Four generations of authentic mithai, handcrafted in Samalkha since {BUSINESS.estYear}.
            Two signature barfis, made the old way — fresh, pure, and unforgettable.
          </p>
          <p className="mt-4 text-xs uppercase tracking-[0.2em] text-[var(--color-gold-light)]/80">
            {BUSINESS.brandLine}
          </p>
        </div>

        {/* Explore */}
        <FooterCol title="Explore">
          {NAV_LINKS.map((l) => (
            <FooterLink key={l.href} href={l.href}>
              {l.label}
            </FooterLink>
          ))}
          <FooterLink href="/shop">Shop All</FooterLink>
        </FooterCol>

        {/* Policies */}
        <FooterCol title="Information">
          {FOOTER_POLICIES.map((l) => (
            <FooterLink key={l.href} href={l.href}>
              {l.label}
            </FooterLink>
          ))}
        </FooterCol>

        {/* Contact */}
        <FooterCol title="Visit & Order">
          <li className="flex gap-3 text-sm text-[var(--color-cream)]/80">
            <MapPin size={18} className="mt-0.5 shrink-0 text-[var(--color-gold-light)]" />
            <span>{BUSINESS.address}</span>
          </li>
          <li>
            <a href={`tel:${BUSINESS.phoneDigits}`} className="flex items-center gap-3 text-sm text-[var(--color-cream)]/80 transition-colors hover:text-[var(--color-gold-light)]">
              <Phone size={18} className="shrink-0 text-[var(--color-gold-light)]" />
              {BUSINESS.phone}
            </a>
          </li>
          <li>
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-[var(--color-cream)]/80 transition-colors hover:text-[var(--color-gold-light)]">
              <MessageCircle size={18} className="shrink-0 text-[var(--color-gold-light)]" />
              WhatsApp Us
            </a>
          </li>
          <li>
            <a href={`mailto:${BUSINESS.email}`} className="flex items-center gap-3 text-sm text-[var(--color-cream)]/80 transition-colors hover:text-[var(--color-gold-light)]">
              <Mail size={18} className="shrink-0 text-[var(--color-gold-light)]" />
              {BUSINESS.email}
            </a>
          </li>
          <li className="pt-1 text-xs text-[var(--color-gold-light)]/70">
            Delivering across {BUSINESS.deliveryArea}
          </li>
        </FooterCol>
      </div>

      <div className="border-t border-[var(--color-gold)]/15">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-5 text-xs text-[var(--color-cream)]/60 sm:flex-row">
          <p>© {year} RGW Sweets. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Handcrafted with <span className="text-[var(--color-gold-light)]">♥</span> &amp; pure desi ghee
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-gold-light)]">
        {title}
      </h3>
      <ul className="flex flex-col gap-2.5">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-sm text-[var(--color-cream)]/75 transition-colors hover:text-[var(--color-gold-light)]">
        {children}
      </Link>
    </li>
  );
}
