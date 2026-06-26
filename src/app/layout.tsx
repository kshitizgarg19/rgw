import type { Metadata } from "next";
import { Playfair_Display, Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { SITE, BUSINESS } from "@/lib/constants";
import { Providers } from "@/components/providers/Providers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { Loader } from "@/components/layout/Loader";
import { HideOnAdmin } from "@/components/layout/HideOnAdmin";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: SITE.defaultTitle,
    template: "%s · RGW Sweets",
  },
  description: SITE.defaultDescription,
  keywords: [...SITE.keywords],
  authors: [{ name: BUSINESS.name }],
  applicationName: BUSINESS.name,
  category: "food",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE.url,
    siteName: BUSINESS.name,
    title: SITE.defaultTitle,
    description: SITE.defaultDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.defaultTitle,
    description: SITE.defaultDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${playfair.variable} ${cormorant.variable} ${inter.variable}`}>
      <body className="flex min-h-screen flex-col">
        <Providers>
          <Loader />
          <Header />
          <main className="flex-1">{children}</main>
          <HideOnAdmin>
            <Footer />
          </HideOnAdmin>
          <WhatsAppButton />
          <CartDrawer />
        </Providers>
      </body>
    </html>
  );
}
