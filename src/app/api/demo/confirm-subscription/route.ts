import { NextRequest } from "next/server";
import { provisionPlatformSubscription } from "@/lib/subscription-provisioning";
import { sendSubscriptionReceiptEmail } from "@/lib/email";
import { PLANS, isPlanSlug } from "@/lib/plans";

export async function POST(request: NextRequest) {
  const { email, plan, businessName } = await request.json();

  if (!email || typeof email !== "string") {
    return Response.json({ error: "Email is required" }, { status: 400 });
  }

  const planSlug = isPlanSlug(plan) ? plan : "pro";
  const normalizedEmail = email.trim().toLowerCase();

  const { tempPassword, isNewAccount } = await provisionPlatformSubscription({
    email: normalizedEmail,
    businessName: businessName?.trim() || undefined,
    plan: planSlug,
    stripeCustomerId: "mock_customer",
    stripeSubscriptionId: `mock_sub_${Date.now()}`,
  });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const planInfo = PLANS[planSlug];

  await sendSubscriptionReceiptEmail({
    to: normalizedEmail,
    planName: planInfo.name,
    priceDisplay: planInfo.price,
    businessName: businessName?.trim() || undefined,
    loginUrl: `${baseUrl}/login`,
    tempPassword,
    isNewAccount,
  });

  return Response.json({ ok: true });
}
