import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { BUSINESS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "The terms that govern your use of the RGW Sweets website and orders.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Information"
      title="Terms & Conditions"
      intro="The simple terms under which we serve you our sweets."
      updated="25 June 2026"
      sections={[
        {
          heading: "Acceptance",
          paragraphs: [
            `By using this website and placing an order with ${BUSINESS.name}, you agree to these terms and conditions.`,
          ],
        },
        {
          heading: "Products & Pricing",
          paragraphs: [
            "All products are freshly handcrafted. Prices are listed in Indian Rupees (₹) and may change from time to time. The price shown at checkout is the price that applies to your order.",
          ],
        },
        {
          heading: "Orders & Confirmation",
          paragraphs: [
            "Online payment is launching soon. For now, when you place an order it is recorded as 'Pending Payment' and our team confirms it with you over WhatsApp to arrange payment and delivery. An order is considered confirmed once we have acknowledged it.",
          ],
        },
        {
          heading: "Delivery",
          paragraphs: [
            `We deliver within ${BUSINESS.deliveryArea}. Delivery timelines are estimates and may vary during peak periods. Please see our Shipping Policy for details.`,
          ],
        },
        {
          heading: "Perishable Goods",
          paragraphs: [
            "Our sweets are perishable. Please refer to our Refund Policy for our quality promise and the limited circumstances in which replacements or refunds apply.",
          ],
        },
        {
          heading: "Intellectual Property",
          paragraphs: [
            `All content, branding, recipes and imagery on this site belong to ${BUSINESS.name} and may not be used without permission.`,
          ],
        },
        {
          heading: "Governing Law",
          paragraphs: [
            "These terms are governed by the laws of India, with jurisdiction in Haryana. For any questions, please contact us.",
          ],
        },
      ]}
    />
  );
}
