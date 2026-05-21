import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { PLANS, PLAN_SLUGS } from "@/lib/plans";

export function PricingTable() {
  return (
    <div className="grid items-center gap-6 md:grid-cols-3">
      {PLAN_SLUGS.map((slug) => {
        const plan = PLANS[slug];
        return (
          <div
            key={plan.slug}
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
            <Link href={`/pricing/${plan.slug}`} className="mt-8 block">
              <Button
                className="w-full"
                variant={plan.popular ? "gradient" : "outline"}
              >
                Get {plan.name}
              </Button>
            </Link>
            <p className="mt-3 text-center text-xs text-slate-500">
              14-day free trial · Cancel anytime
            </p>
          </div>
        );
      })}
    </div>
  );
}
