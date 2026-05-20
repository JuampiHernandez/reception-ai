"use client";

import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "$49",
    features: ["500 calls/mo", "Basic booking", "Email support"],
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
    ],
    popular: true,
  },
  {
    name: "Business",
    price: "$199",
    features: ["Multi-location", "Analytics", "Priority support", "API access"],
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
    <div className="grid gap-6 md:grid-cols-3">
      {plans.map((plan) => (
        <div
          key={plan.name}
          className={`rounded-2xl border bg-white p-6 shadow-sm ${
            plan.popular
              ? "border-reception-blue ring-2 ring-reception-blue"
              : "border-slate-200"
          }`}
        >
          {plan.popular && (
            <span className="mb-4 inline-block rounded-full bg-reception-blue px-3 py-1 text-xs font-medium text-white">
              Most popular
            </span>
          )}
          <h3 className="text-xl font-semibold">{plan.name}</h3>
          <p className="mt-2 text-3xl font-bold">
            {plan.price}
            <span className="text-base font-normal text-slate-gray">/mo</span>
          </p>
          <ul className="mt-6 space-y-3">
            {plan.features.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-soft-mint" />
                {f}
              </li>
            ))}
          </ul>
          <Button
            className="mt-8 w-full"
            variant={plan.popular ? "primary" : "secondary"}
            onClick={() =>
              subscribe(plan.name.toLowerCase())
            }
          >
            Start free trial
          </Button>
        </div>
      ))}
    </div>
  );
}
