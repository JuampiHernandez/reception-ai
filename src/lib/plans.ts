export type PlanSlug = "starter" | "pro" | "business";

export type Plan = {
  slug: PlanSlug;
  name: string;
  price: string;
  priceMonthly: number;
  description: string;
  features: string[];
  popular: boolean;
};

export const PLANS: Record<PlanSlug, Plan> = {
  starter: {
    slug: "starter",
    name: "Starter",
    price: "$49",
    priceMonthly: 49,
    description:
      "Everything you need to answer calls and book appointments for a growing solo practice.",
    features: [
      "500 calls/month",
      "Basic booking",
      "Email support",
      "Standard integrations",
    ],
    popular: false,
  },
  pro: {
    slug: "pro",
    name: "Pro",
    price: "$99",
    priceMonthly: 99,
    description:
      "Unlimited calls, Stripe payment links, and voice customization for professionals who live on the phone.",
    features: [
      "Unlimited calls",
      "Payment links via Stripe",
      "Collect deposits",
      "Voice customization",
      "Priority support",
      "Advanced integrations",
    ],
    popular: true,
  },
  business: {
    slug: "business",
    name: "Business",
    price: "$199",
    priceMonthly: 199,
    description:
      "Multi-location support, analytics, and API access for teams scaling their front desk.",
    features: [
      "Everything in Pro",
      "Multi-location support",
      "Analytics & insights",
      "API access",
      "Dedicated onboarding",
      "SLA & priority support",
    ],
    popular: false,
  },
};

export const PLAN_SLUGS = Object.keys(PLANS) as PlanSlug[];

export function isPlanSlug(value: string): value is PlanSlug {
  return value in PLANS;
}

export function getPlanPriceId(plan: PlanSlug): string | undefined {
  if (plan === "starter") return process.env.STRIPE_PRICE_STARTER;
  if (plan === "business") return process.env.STRIPE_PRICE_BUSINESS;
  return process.env.STRIPE_PRICE_PRO;
}

export function isValidStripePriceId(priceId?: string): priceId is string {
  if (!priceId) return false;
  if (priceId.includes("...") || priceId.includes("placeholder")) return false;
  return priceId.startsWith("price_");
}
