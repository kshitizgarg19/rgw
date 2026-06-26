import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { ADMIN_COOKIE } from "@/lib/constants";
import type { AdminRole } from "@/lib/types";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "rgw-dev-secret-change-me"
);

export type Session = {
  sub: string;
  email: string;
  name: string;
  role: AdminRole;
};

export async function createToken(payload: Session): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifyToken(token: string): Promise<Session | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as Session;
  } catch {
    return null;
  }
}

export async function setSessionCookie(token: string) {
  (await cookies()).set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSessionCookie() {
  (await cookies()).delete(ADMIN_COOKIE);
}

export async function getSession(): Promise<Session | null> {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!token) return null;
  return verifyToken(token);
}

/** Use in admin server components/actions — redirects to login if unauthenticated. */
export async function requireAdmin(): Promise<Session> {
  const session = await getSession();
  if (!session) redirect("/rgw-admin-login");
  return session;
}

export async function requireSuperAdmin(): Promise<Session> {
  const session = await requireAdmin();
  if (session.role !== "SUPER_ADMIN") {
    throw new Error("This action requires Super Admin access.");
  }
  return session;
}

export const hashPassword = (pw: string) => bcrypt.hash(pw, 10);
export const verifyPassword = (pw: string, hash: string) => bcrypt.compare(pw, hash);
