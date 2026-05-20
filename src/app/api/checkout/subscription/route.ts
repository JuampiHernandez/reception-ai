import { NextRequest } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { createSubscriptionCheckout } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  const session = await getSessionUser();
  if (!session?.tenant) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { plan } = await request.json();
  const priceId =
    plan === "starter"
      ? process.env.STRIPE_PRICE_STARTER
      : plan === "business"
        ? process.env.STRIPE_PRICE_BUSINESS
        : process.env.STRIPE_PRICE_PRO;

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const { url } = await createSubscriptionCheckout({
    tenantId: session.tenant.id,
    priceId: priceId || "price_pro_placeholder",
    successUrl: `${baseUrl}/dashboard?subscribed=1`,
    cancelUrl: `${baseUrl}/#pricing`,
    customerEmail: session.user.email,
  });

  return Response.json({ url });
}
