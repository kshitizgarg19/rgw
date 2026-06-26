/* ============================================================================
   PhonePe Payment Gateway — INTEGRATION POINT  ⚠️ ON HOLD (next phase)
   ----------------------------------------------------------------------------
   Online payment is intentionally NOT wired up in this phase. This module is
   the single place to switch it on later WITHOUT changing the checkout flow.

   The checkout already calls `initiatePayment()` and knows how to handle a
   `{ status: "redirect", redirectUrl }` result. Today it returns
   `{ status: "coming_soon" }`, so orders are saved as "Pending Payment" and
   confirmed manually over WhatsApp.

   To enable PhonePe later:
     1. Set PAYMENT_ENABLED = true and fill the env vars in .env
        (PHONEPE_MERCHANT_ID, PHONEPE_SALT_KEY, PHONEPE_SALT_INDEX, PHONEPE_ENV).
     2. Implement the request inside `initiatePayment()` (steps inline below).
     3. Add a callback route handler (e.g. /api/payment/phonepe/callback) that
        verifies X-VERIFY, marks the order PAID/FAILED, and stores paymentRef.
   ========================================================================== */

export const PAYMENT_ENABLED = false;

export const phonePeConfig = {
  merchantId: process.env.PHONEPE_MERCHANT_ID ?? "",
  saltKey: process.env.PHONEPE_SALT_KEY ?? "",
  saltIndex: process.env.PHONEPE_SALT_INDEX ?? "1",
  env: (process.env.PHONEPE_ENV ?? "UAT") as "UAT" | "PROD",
  // Hosts for reference when enabling:
  // UAT:  https://api-preprod.phonepe.com/apis/pg-sandbox
  // PROD: https://api.phonepe.com/apis/hermes
};

export type PaymentInitInput = {
  orderNumber: string;
  amount: number; // rupees
  customerName: string;
  mobile: string;
  redirectUrl: string;
  callbackUrl: string;
};

export type PaymentInitResult =
  | { status: "redirect"; redirectUrl: string }
  | { status: "coming_soon" };

/**
 * Begin a payment. Returns { status: "coming_soon" } while payment is on hold.
 *
 * When enabling PhonePe, implement here:
 *   const payload = {
 *     merchantId: phonePeConfig.merchantId,
 *     merchantTransactionId: input.orderNumber,
 *     amount: Math.round(input.amount * 100), // paise
 *     redirectUrl: input.redirectUrl,
 *     redirectMode: "POST",
 *     callbackUrl: input.callbackUrl,
 *     mobileNumber: input.mobile,
 *     paymentInstrument: { type: "PAY_PAGE" },
 *   };
 *   const base64 = Buffer.from(JSON.stringify(payload)).toString("base64");
 *   const xVerify =
 *     sha256(base64 + "/pg/v1/pay" + phonePeConfig.saltKey) + "###" + phonePeConfig.saltIndex;
 *   POST `${host}/pg/v1/pay` with { request: base64 } and header "X-VERIFY".
 *   return { status: "redirect", redirectUrl: res.data.instrumentResponse.redirectInfo.url };
 */
export async function initiatePayment(
  _input: PaymentInitInput
): Promise<PaymentInitResult> {
  if (!PAYMENT_ENABLED) {
    return { status: "coming_soon" };
  }
  // TODO(payment): implement the PhonePe pay request described above.
  throw new Error("PhonePe integration is not enabled yet.");
}
