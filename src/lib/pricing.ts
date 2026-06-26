/** Pure pricing helpers shared by cart UI and server order creation. */

export function computeDelivery(
  subtotal: number,
  shipping: { charge: number; freeAbove: number }
): number {
  if (subtotal <= 0) return 0;
  return subtotal >= shipping.freeAbove ? 0 : shipping.charge;
}

export function couponDiscount(
  coupon: { type: string; value: number; minOrder: number },
  subtotal: number
): number {
  if (subtotal < coupon.minOrder) return 0;
  const d =
    coupon.type === "PERCENT"
      ? Math.round((subtotal * coupon.value) / 100)
      : coupon.value;
  return Math.min(d, subtotal);
}
