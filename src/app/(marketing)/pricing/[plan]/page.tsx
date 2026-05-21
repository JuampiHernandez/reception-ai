import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, ArrowLeft } from "lucide-react";
import { LandingHeader } from "@/components/landing/Header";
import { PlanCheckoutForm } from "@/components/landing/PlanCheckoutForm";
import { Button } from "@/components/ui/button";
import { PLANS, isPlanSlug } from "@/lib/plans";

type PageProps = {
  params: Promise<{ plan: string }>;
};

export async function generateStaticParams() {
  return [{ plan: "starter" }, { plan: "pro" }, { plan: "business" }];
}

export async function generateMetadata({ params }: PageProps) {
  const { plan: planSlug } = await params;
  if (!isPlanSlug(planSlug)) return { title: "Plan not found" };
  const plan = PLANS[planSlug];
  return {
    title: `${plan.name} Plan — Reception.ai`,
    description: plan.description,
  };
}

export default async function PlanPage({ params }: PageProps) {
  const { plan: planSlug } = await params;
  if (!isPlanSlug(planSlug)) notFound();

  const plan = PLANS[planSlug];

  return (
    <>
      <LandingHeader />

      <section className="px-6 pb-24 pt-12">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/#pricing"
            className="inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to pricing
          </Link>

          <div className="mt-8 grid items-start gap-10 lg:grid-cols-2">
            <div>
              {plan.popular && (
                <span className="inline-block rounded-full gradient-bg px-4 py-1 text-xs font-semibold text-white">
                  ✦ Most popular
                </span>
              )}
              <h1 className="mt-4 text-4xl font-bold text-white md:text-5xl">
                {plan.name} plan
              </h1>
              <p className="mt-2">
                <span className="text-4xl font-bold text-white">{plan.price}</span>
                <span className="text-lg text-slate-400">/month</span>
              </p>
              <p className="mt-6 text-lg leading-relaxed text-slate-400">
                {plan.description}
              </p>

              <ul className="mt-8 space-y-4">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-slate-300"
                  >
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-reception-purple" />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="mt-10 rounded-xl border border-white/10 bg-white/[0.02] p-5">
                <p className="text-sm font-medium text-white">What happens next</p>
                <ol className="mt-3 list-inside list-decimal space-y-2 text-sm text-slate-400">
                  <li>Enter your email and complete checkout on Stripe</li>
                  <li>Receive a receipt and account details by email</li>
                  <li>Log in to your dashboard and set up your AI receptionist</li>
                </ol>
              </div>
            </div>

            <PlanCheckoutForm
              plan={plan.slug}
              planName={plan.name}
              price={plan.price}
            />
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-slate-500">
              Not sure which plan fits?{" "}
              <Link href="/#pricing" className="text-reception-purple hover:underline">
                Compare all plans
              </Link>
            </p>
            <div className="mt-4">
              <Link href="/#pricing">
                <Button variant="outline" size="sm">
                  View all plans
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/5 px-6 py-8 text-center text-sm text-slate-500">
        <p>Reception.ai — AI receptionist infrastructure for solo professionals.</p>
      </footer>
    </>
  );
}
