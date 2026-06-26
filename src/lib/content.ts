import "server-only";
import { prisma } from "@/lib/db";
import { DELIVERY } from "@/lib/constants";

/** Read an editable content blob (JSON-parsed) with a fallback. */
export async function getContent<T = unknown>(key: string, fallback: T): Promise<T> {
  const row = await prisma.siteContent.findUnique({ where: { key } });
  if (!row) return fallback;
  try {
    return JSON.parse(row.value) as T;
  } catch {
    return row.value as unknown as T;
  }
}

export async function setContent(key: string, value: unknown): Promise<void> {
  const str = typeof value === "string" ? value : JSON.stringify(value);
  await prisma.siteContent.upsert({
    where: { key },
    update: { value: str },
    create: { key, value: str },
  });
}

export type ShippingSettings = { charge: number; freeAbove: number; etaText: string };

export async function getShippingSettings(): Promise<ShippingSettings> {
  return getContent<ShippingSettings>("shipping", {
    charge: DELIVERY.charge,
    freeAbove: DELIVERY.freeAbove,
    etaText: DELIVERY.etaText,
  });
}
