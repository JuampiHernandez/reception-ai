"use client";

import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "$49",
    features: [
      "500 calls/month",
      "Basic booking",
      "Email support",
      "Standard integrations",
    ],
    popular: false,
  },
  {
    name: "Pro",
    price: "$99",
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
  {
    name: "Business",
    price: "$199",
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
];

export function PricingTable() {
  async function subscribe(plan: string) {
    const res = await fetch("/api/checkout/subscription", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else window.location.href = "/login";
  }

  return (
    <div className="grid items-center gap-6 md:grid-cols-3">
      {plans.map((plan) => (
        <div
          key={plan.name}
          className={`relative rounded-2xl p-6 ${
            plan.popular
              ? "gradient-border marketing-glow scale-[1.02] bg-white/[0.05] md:py-8"
              : "border border-white/10 bg-white/[0.03]"
          }`}
        >
          {plan.popular && (
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full gradient-bg px-4 py-1 text-xs font-semibold text-white">
              ✦ Most popular
            </span>
          )}
          <h3 className="text-xl font-semibold text-white">{plan.name}</h3>
          <p className="mt-2">
            <span className="text-4xl font-bold text-white">{plan.price}</span>
            <span className="text-base text-slate-400">/mo</span>
          </p>
          <ul className="mt-6 space-y-3">
            {plan.features.map((f) => (
              <li key={f} className="flex items-center gap-2.5 text-sm text-slate-300">
                <Check className="h-4 w-4 shrink-0 text-reception-purple" />
                {f}
              </li>
            ))}
          </ul>
          <Button
            className="mt-8 w-full"
            variant={plan.popular ? "gradient" : "outline"}
            onClick={() => subscribe(plan.name.toLowerCase())}
          >
            Start free trial
          </Button>
          <p className="mt-3 text-center text-xs text-slate-500">
            No credit card required
          </p>
        </div>
      ))}
    </div>
  );
}
