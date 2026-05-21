import { NextRequest } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { createSubscriptionCheckout } from "@/lib/stripe";
import { getPlanPriceId, isPlanSlug } from "@/lib/plans";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { plan, email, businessName } = body;

  if (!isPlanSlug(plan)) {
    return Response.json({ error: "Invalid plan" }, { status: 400 });
  }

  const session = await getSessionUser();
  const customerEmail = (email || session?.user.email)?.trim().toLowerCase();

  if (!customerEmail) {
    return Response.json({ error: "Email is required" }, { status: 400 });
  }

  const priceId = getPlanPriceId(plan);
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const { url } = await createSubscriptionCheckout({
    tenantId: session?.tenant?.id,
    plan,
    priceId: priceId || "price_pro_placeholder",
    successUrl: `${baseUrl}/pricing/success?plan=${plan}`,
    cancelUrl: `${baseUrl}/pricing/${plan}`,
    customerEmail,
    businessName: businessName?.trim() || undefined,
  });

  return Response.json({ url });
}
