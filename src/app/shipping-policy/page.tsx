import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { BUSINESS, DELIVERY } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Shipping Policy",
  description: "How RGW Sweets delivers fresh Mawa and Ghiya Barfi across Delhi NCR.",
  alternates: { canonical: "/shipping-policy" },
};

export default function ShippingPolicyPage() {
  return (
    <LegalPage
      eyebrow="Information"
      title="Shipping Policy"
      intro="Everything you need to know about how your sweets reach you, fresh."
      updated="25 June 2026"
      sections={[
        {
          heading: "Delivery Area",
          paragraphs: [
            `We currently deliver across ${BUSINESS.deliveryArea}. If your location falls just outside this region, message us on WhatsApp at ${BUSINESS.whatsapp} and we'll do our best to help.`,
          ],
        },
        {
          heading: "Freshly Prepared to Order",
          paragraphs: [
            "Because our barfi is made fresh in small batches once you order, we typically prepare and dispatch within 24–48 hours. We never deliver pre-made or long-stored sweets.",
            DELIVERY.etaText,
          ],
        },
        {
          heading: "Delivery Charges",
          paragraphs: [
            `A standard delivery charge of ₹${DELIVERY.charge} applies within ${BUSINESS.deliveryArea}. Orders above ₹${DELIVERY.freeAbove} qualify for free delivery. Final charges are always shown clearly at checkout.`,
          ],
        },
        {
          heading: "Handling Your Sweets",
          paragraphs: [
            "Our sweets are perishable and made without artificial preservatives. Please refrigerate them on arrival and enjoy within the freshness window mentioned on each product.",
          ],
        },
        {
          heading: "Delays",
          paragraphs: [
            "During festivals, peak season, or adverse weather, deliveries may take slightly longer. We'll always keep you informed over WhatsApp.",
          ],
        },
        {
          heading: "Questions",
          paragraphs: [
            `For anything about your delivery, call or WhatsApp us at ${BUSINESS.phone}. We're a family business and happy to help personally.`,
          ],
        },
      ]}
    />
  );
}
