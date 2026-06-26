/* ============================================================================
   Order confirmation hooks.
   ----------------------------------------------------------------------------
   Wired into order creation. The real "send" integrations (transactional email
   + WhatsApp Business API) are stubbed for now and simply log on the server;
   they can be switched on when payment goes live. `buildWhatsAppOrderMessage`
   is also used to build the customer-facing "confirm on WhatsApp" deep link.
   ========================================================================== */
import { BUSINESS } from "@/lib/constants";

export type OrderNotice = {
  orderNumber: string;
  fullName: string;
  mobile: string;
  email?: string | null;
  total: number;
  items: { name: string; quantity: number }[];
  address: string;
};

export function buildWhatsAppOrderMessage(o: OrderNotice): string {
  const lines = o.items.map((i) => `• ${i.name} × ${i.quantity}`).join("\n");
  return [
    `Hello RGW Sweets! I'd like to confirm my order ${o.orderNumber}.`,
    ``,
    lines,
    ``,
    `Total: ₹${o.total}`,
    `Name: ${o.fullName}`,
    `Deliver to: ${o.address}`,
  ].join("\n");
}

export function customerWhatsAppLink(o: OrderNotice): string {
  return `https://wa.me/${BUSINESS.whatsappDigits}?text=${encodeURIComponent(buildWhatsAppOrderMessage(o))}`;
}

/** Send the order confirmation email. Stub for now — enable with a provider. */
export async function sendConfirmationEmail(o: OrderNotice): Promise<void> {
  // TODO(notifications): integrate Resend / SES / Nodemailer here.
  console.log(`[email:stub] Order ${o.orderNumber} confirmation → ${o.email ?? "no email"}`);
}

/** Notify the shop (and/or customer) on WhatsApp. Stub for now. */
export async function sendWhatsAppConfirmation(o: OrderNotice): Promise<void> {
  // TODO(notifications): integrate WhatsApp Business / Cloud API here.
  console.log(`[whatsapp:stub] Order ${o.orderNumber} for ${o.fullName} (${o.mobile}) — ₹${o.total}`);
}
