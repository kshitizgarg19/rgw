import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { BUSINESS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "RGW Sweets refund and replacement policy for our fresh mithai.",
  alternates: { canonical: "/refund-policy" },
};

export default function RefundPolicyPage() {
  return (
    <LegalPage
      eyebrow="Information"
      title="Refund Policy"
      intro="Our promise on quality — and what happens in the rare case something isn't right."
      updated="25 June 2026"
      sections={[
        {
          heading: "Perishable Products",
          paragraphs: [
            "As our sweets are freshly made, perishable food items, we are unable to accept returns or exchanges once an order has been delivered and accepted.",
          ],
        },
        {
          heading: "If Something Is Wrong",
          paragraphs: [
            `Your satisfaction matters deeply to us. If your order arrives damaged, incorrect, or with a genuine quality issue, please contact us within 24 hours of delivery on WhatsApp at ${BUSINESS.whatsapp} with a photo.`,
            "Once verified, we will gladly arrange a replacement or an appropriate refund.",
          ],
        },
        {
          heading: "Cancellations",
          paragraphs: [
            "Because each order is prepared fresh, cancellations are only possible before preparation begins. Reach out to us as soon as possible if you need to cancel and we'll assist where we can.",
          ],
        },
        {
          heading: "Refund Processing",
          paragraphs: [
            "Online payment is launching soon. At present, orders are confirmed and settled directly with our team over WhatsApp, so any agreed refund is handled the same way. Once online payments go live, approved refunds will be returned to your original payment method within 5–7 business days.",
          ],
        },
      ]}
    />
  );
}
