import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { verifyPassword, createToken, setSessionCookie } from "@/lib/auth";
import type { AdminRole } from "@/lib/types";

export const dynamic = "force-dynamic";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter your email and password." }, { status: 400 });
  }
  const email = parsed.data.email.toLowerCase().trim();
  const admin = await prisma.adminUser.findUnique({ where: { email } });
  if (!admin || !(await verifyPassword(parsed.data.password, admin.passwordHash))) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }
  const token = await createToken({
    sub: admin.id,
    email: admin.email,
    name: admin.name,
    role: admin.role as AdminRole,
  });
  await setSessionCookie(token);
  return NextResponse.json({ ok: true });
}
