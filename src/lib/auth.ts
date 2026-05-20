import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";

const SESSION_COOKIE = "reception_session";

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createSession(userId: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSessionUser() {
  const cookieStore = await cookies();
  const userId = cookieStore.get(SESSION_COOKIE)?.value;
  if (!userId) return null;

  const user = await db.query.users.findFirst({
    where: eq(schema.users.id, userId),
  });
  if (!user) return null;

  const tenant = await db.query.tenants.findFirst({
    where: eq(schema.tenants.id, user.tenantId),
  });

  return { user, tenant };
}

export async function authenticateTenantApiKey(
  tenantSlug: string,
  apiKey: string | null
) {
  if (!apiKey) return null;
  const tenant = await db.query.tenants.findFirst({
    where: eq(schema.tenants.slug, tenantSlug),
  });
  if (!tenant || tenant.apiKey !== apiKey) return null;
  return tenant;
}
