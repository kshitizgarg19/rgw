import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { BUSINESS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How RGW Sweets collects, uses and protects your information.",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      eyebrow="Information"
      title="Privacy Policy"
      intro="We respect your privacy and only use your details to serve you better."
      updated="25 June 2026"
      sections={[
        {
          heading: "Information We Collect",
          paragraphs: [
            "When you place an order, we collect the details you provide: your name, mobile number, email (optional), and delivery address. We also keep a record of your orders to serve you better.",
          ],
        },
        {
          heading: "How We Use It",
          paragraphs: [
            "Your information is used solely to prepare and deliver your order, to confirm details with you (currently over WhatsApp), and to provide support. We may send order-related updates.",
          ],
        },
        {
          heading: "We Never Sell Your Data",
          paragraphs: [
            "We do not sell, rent, or trade your personal information with third parties. Details are shared only with trusted delivery partners strictly to fulfil your order.",
          ],
        },
        {
          heading: "Cookies & Local Storage",
          paragraphs: [
            "Your cart and wishlist are stored locally in your browser for convenience. We use minimal, functional storage — not for advertising.",
          ],
        },
        {
          heading: "Your Choices",
          paragraphs: [
            `You may request access to, correction of, or deletion of your personal information at any time. Just contact us at ${BUSINESS.email} or ${BUSINESS.phone}.`,
          ],
        },
      ]}
    />
  );
}
