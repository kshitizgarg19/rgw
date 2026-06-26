import "server-only";
import { prisma } from "@/lib/db";

export async function getOrderByNumber(orderNumber: string) {
  return prisma.order.findUnique({
    where: { orderNumber },
    include: { items: true },
  });
}
