"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { PlanSlug } from "@/lib/plans";

type PlanCheckoutFormProps = {
  plan: PlanSlug;
  planName: string;
  price: string;
};

export function PlanCheckoutForm({ plan, planName, price }: PlanCheckoutFormProps) {
  const [email, setEmail] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/checkout/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan,
          email: email.trim(),
          businessName: businessName.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not start checkout. Please try again.");
        return;
      }

      if (data.url) {
        window.location.href = data.url;
        return;
      }

      setError("Could not start checkout. Please try again.");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleCheckout}
      className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8"
    >
      <h2 className="text-xl font-semibold text-white">Subscribe to {planName}</h2>
      <p className="mt-2 text-sm text-slate-400">
        {price}/month · 14-day free trial · Cancel anytime
      </p>

      <div className="mt-6 space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-300">
            Work email
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@yourbusiness.com"
            className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-reception-purple/50 focus:outline-none focus:ring-2 focus:ring-reception-purple/20"
          />
        </div>

        <div>
          <label
            htmlFor="businessName"
            className="block text-sm font-medium text-slate-300"
          >
            Business name <span className="text-slate-500">(optional)</span>
          </label>
          <input
            id="businessName"
            type="text"
            autoComplete="organization"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="Your practice or business"
            className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-reception-purple/50 focus:outline-none focus:ring-2 focus:ring-reception-purple/20"
          />
        </div>
      </div>

      {error && (
        <p className="mt-4 text-sm text-red-400" role="alert">
          {error}
        </p>
      )}

      <Button
        type="submit"
        variant="gradient"
        size="lg"
        className="mt-6 w-full"
        disabled={loading}
      >
        {loading ? "Redirecting to checkout…" : `Subscribe — ${price}/mo`}
      </Button>

      <p className="mt-4 text-center text-xs text-slate-500">
        Secure checkout powered by Stripe. You&apos;ll receive a receipt by email.
      </p>
    </form>
  );
}
