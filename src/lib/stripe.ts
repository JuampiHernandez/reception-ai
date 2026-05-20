import Stripe from "stripe";

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
  successUrl: string;
  cancelUrl: string;
}) {
  const stripe = getStripe();
  if (!stripe) {
    const mockUrl = `${params.successUrl}?mock_payment=1&appointment_id=${params.appointmentId}`;
    return { url: mockUrl, sessionId: `mock_${params.appointmentId}` };
  }

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
    customer_email: undefined,
  });

  return { url: session.url!, sessionId: session.id };
}

export async function createSubscriptionCheckout(params: {
  tenantId: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  customerEmail?: string;
}) {
  const stripe = getStripe();
  if (!stripe) {
    return { url: params.successUrl + "?mock_subscription=1", sessionId: "mock_sub" };
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: params.priceId, quantity: 1 }],
    metadata: { tenant_id: params.tenantId, type: "platform_subscription" },
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    customer_email: params.customerEmail,
  });

  return { url: session.url!, sessionId: session.id };
}
