import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import type { PlanSlug } from "@/lib/plans";

function slugFromEmail(email: string): string {
  const base = email
    .split("@")[0]
    .replace(/[^a-z0-9]/gi, "-")
    .toLowerCase()
    .replace(/^-+|-+$/g, "")
    .slice(0, 24);
  const suffix = randomUUID().slice(0, 6);
  return `${base || "team"}-${suffix}`;
}

export async function provisionPlatformSubscription(params: {
  email: string;
  businessName?: string;
  plan: PlanSlug;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
}): Promise<{ tenantId: string; tempPassword?: string; isNewAccount: boolean }> {
  const email = params.email.trim().toLowerCase();

  if (params.stripeSubscriptionId) {
    const existing = await db.query.platformSubscriptions.findFirst({
      where: eq(schema.platformSubscriptions.stripeSubscriptionId, params.stripeSubscriptionId),
    });
    if (existing) {
      return { tenantId: existing.tenantId, isNewAccount: false };
    }
  }

  const existingUser = await db.query.users.findFirst({
    where: eq(schema.users.email, email),
  });

  let tenantId: string;
  let tempPassword: string | undefined;
  let isNewAccount = false;

  if (existingUser) {
    tenantId = existingUser.tenantId;
    await db
      .update(schema.tenants)
      .set({ stripeCustomerId: params.stripeCustomerId })
      .where(eq(schema.tenants.id, tenantId));
  } else {
    isNewAccount = true;
    tenantId = randomUUID();
    tempPassword = randomUUID().replace(/-/g, "").slice(0, 12);
    const passwordHash = await hashPassword(tempPassword);
    const slug = slugFromEmail(email);
    const displayName = params.businessName?.trim() || email.split("@")[0];

    await db.insert(schema.tenants).values({
      id: tenantId,
      slug,
      name: displayName,
      businessType: "general",
      apiKey: randomUUID().replace(/-/g, ""),
      stripeCustomerId: params.stripeCustomerId,
      greeting: `Hello, welcome to ${displayName}. How can I help you today?`,
    });

    await db.insert(schema.users).values({
      id: randomUUID(),
      email,
      passwordHash,
      tenantId,
      name: displayName,
    });
  }

  await db.insert(schema.platformSubscriptions).values({
    id: randomUUID(),
    tenantId,
    stripeCustomerId: params.stripeCustomerId,
    stripeSubscriptionId: params.stripeSubscriptionId,
    plan: params.plan,
    status: "active",
  });

  return { tenantId, tempPassword, isNewAccount };
}
