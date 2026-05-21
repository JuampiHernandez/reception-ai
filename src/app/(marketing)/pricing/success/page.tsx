"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { LandingHeader } from "@/components/landing/Header";
import { Button } from "@/components/ui/button";
import { PLANS, isPlanSlug } from "@/lib/plans";

function SuccessContent() {
  const searchParams = useSearchParams();
  const planSlug = searchParams.get("plan");
  const mock = searchParams.get("mock_subscription");
  const email = searchParams.get("email");
  const businessName = searchParams.get("business_name");
  const [confirmed, setConfirmed] = useState(false);
  const plan =
    planSlug && isPlanSlug(planSlug) ? PLANS[planSlug] : PLANS.pro;

  useEffect(() => {
    if (mock !== "1" || !email) {
      if (mock !== "1") setConfirmed(true);
      return;
    }

    fetch("/api/demo/confirm-subscription", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        plan: planSlug || "pro",
        businessName: businessName || undefined,
      }),
    }).then(() => setConfirmed(true));
  }, [mock, email, planSlug, businessName]);

  return (
    <>
      <LandingHeader />

      <section className="px-6 py-24">
        <div className="mx-auto max-w-lg text-center">
          <div className="gradient-border marketing-glow rounded-2xl bg-white/[0.03] p-8 md:p-10">
            <CheckCircle2 className="mx-auto h-16 w-16 text-soft-mint" />
            <h1 className="mt-6 text-3xl font-bold text-white">
              {confirmed ? "You're subscribed!" : "Processing subscription…"}
            </h1>
            <p className="mt-4 text-slate-400">
              {confirmed
                ? `Welcome to Reception.ai ${plan.name}. We've sent a receipt and your account details to your email.`
                : "Please wait while we confirm your subscription."}
            </p>
            <p className="mt-2 text-sm text-slate-500">
              {plan.price}/month · {plan.name} plan
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/login">
                <Button variant="gradient">Go to dashboard</Button>
              </Link>
              <Link href="/">
                <Button variant="outline">Back to home</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default function PricingSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center text-slate-500">Loading…</div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
