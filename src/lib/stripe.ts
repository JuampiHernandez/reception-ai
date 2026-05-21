import Stripe from "stripe";
import { PLANS, isValidStripePriceId, type PlanSlug } from "@/lib/plans";

let stripeClient: Stripe | null = null;

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || key.includes("placeholder")) return null;
  if (!stripeClient) {
    stripeClient = new Stripe(key);
  }
  return stripeClient;
}

export function isStripeConfigured() {
  return Boolean(
    process.env.STRIPE_SECRET_KEY &&
      !process.env.STRIPE_SECRET_KEY.includes("placeholder")
  );
}

export async function createAppointmentCheckout(params: {
  appointmentId: string;
  tenantSlug: string;
  serviceName: string;
  amountCents: number;
  currency: string;
  patientName?: string;
  patientEmail?: string;
  successUrl: string;
  cancelUrl: string;
}) {
  const stripe = getStripe();
  if (!stripe) {
    const mockUrl = `${params.successUrl}?mock_payment=1&appointment_id=${params.appointmentId}`;
    return { url: mockUrl, sessionId: `mock_${params.appointmentId}` };
  }

  const customerEmail = params.patientEmail?.trim().toLowerCase();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: params.currency,
          unit_amount: params.amountCents,
          product_data: {
            name: params.serviceName,
            description: `Appointment deposit - ${params.tenantSlug}`,
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      appointment_id: params.appointmentId,
      tenant_slug: params.tenantSlug,
      type: "appointment_deposit",
    },
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    ...(customerEmail
      ? {
          customer_email: customerEmail,
          payment_intent_data: { receipt_email: customerEmail },
        }
      : {}),
  });

  return { url: session.url!, sessionId: session.id };
}

export async function createSubscriptionCheckout(params: {
  tenantId?: string;
  plan: PlanSlug;
  priceId?: string;
  successUrl: string;
  cancelUrl: string;
  customerEmail: string;
  businessName?: string;
}) {
  const stripe = getStripe();
  if (!stripe) {
    const mockUrl = new URL(params.successUrl);
    mockUrl.searchParams.set("mock_subscription", "1");
    mockUrl.searchParams.set("email", params.customerEmail);
    if (params.businessName) {
      mockUrl.searchParams.set("business_name", params.businessName);
    }
    return { url: mockUrl.toString(), sessionId: "mock_sub" };
  }

  const planInfo = PLANS[params.plan];
  const metadata = {
    ...(params.tenantId ? { tenant_id: params.tenantId } : {}),
    type: "platform_subscription",
    plan: params.plan,
    customer_email: params.customerEmail,
    ...(params.businessName ? { business_name: params.businessName } : {}),
  };

  const lineItems =
    isValidStripePriceId(params.priceId)
      ? [{ price: params.priceId, quantity: 1 }]
      : [
          {
            price_data: {
              currency: "usd",
              unit_amount: planInfo.priceMonthly * 100,
              recurring: { interval: "month" as const },
              product_data: {
                name: `Reception.ai ${planInfo.name}`,
                description: planInfo.description,
              },
            },
            quantity: 1,
          },
        ];

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: lineItems,
    metadata,
    subscription_data: {
      metadata: {
        plan: params.plan,
        ...(params.businessName ? { business_name: params.businessName } : {}),
      },
    },
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    customer_email: params.customerEmail,
  });

  return { url: session.url!, sessionId: session.id };
}
