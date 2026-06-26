import "server-only";
import { prisma } from "@/lib/db";

export async function getDashboardStats() {
  const now = new Date();
  const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [total, today, month, pending, completed, revenue, customers, recent, newOrders] =
    await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { createdAt: { gte: startToday } } }),
      prisma.order.count({ where: { createdAt: { gte: startMonth } } }),
      prisma.order.count({ where: { orderStatus: { in: ["NEW", "PROCESSING"] } } }),
      prisma.order.count({ where: { orderStatus: "DELIVERED" } }),
      prisma.order.aggregate({ _sum: { total: true } }),
      prisma.customer.count(),
      prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 8, include: { items: true } }),
      prisma.order.findMany({ where: { orderStatus: "NEW" }, orderBy: { createdAt: "desc" }, take: 5, include: { items: true } }),
    ]);

  return {
    total,
    today,
    month,
    pending,
    completed,
    customers,
    revenue: revenue._sum.total ?? 0,
    recent,
    newOrders,
  };
}
