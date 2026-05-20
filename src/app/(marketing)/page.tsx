import Link from "next/link";
import {
  Phone,
  Calendar,
  HelpCircle,
  Send,
  CreditCard,
  CheckCircle,
  Heart,
  Scale,
  Smile,
  Wrench,
  Zap,
  Shield,
  Clock,
  Play,
  Lock,
  Award,
} from "lucide-react";
import { LandingHeader } from "@/components/landing/Header";
import { LiveCallCard } from "@/components/brand/LiveCallCard";
import { PricingTable } from "@/components/landing/PricingTable";
import { Button } from "@/components/ui/button";
import { clinicPath } from "@/lib/routes";

const features = [
  {
    icon: Phone,
    title: "Answers Calls 24/7",
    desc: "Never miss a call again. Your AI receptionist picks up instantly, day or night.",
    status: "Always available",
    accent: "purple" as const,
  },
  {
    icon: Calendar,
    title: "Books Appointments",
    desc: "Checks availability, books appointments, and syncs with your calendar.",
    status: "Seamless scheduling",
    accent: "blue" as const,
  },
  {
    icon: HelpCircle,
    title: "Answers FAQs",
    desc: "Instantly answers common questions about your services, hours, and policies.",
    status: "Smart & accurate",
    accent: "purple" as const,
  },
  {
    icon: Send,
    title: "Sends Payment Links",
    desc: "Sends secure payment links via SMS so clients can pay on the spot.",
    status: "Stripe powered",
    accent: "blue" as const,
  },
  {
    icon: CreditCard,
    title: "Collects Deposits",
    desc: "Collects deposits and payments securely to reduce no-shows.",
    status: "Secure & trusted",
    accent: "purple" as const,
  },
  {
    icon: CheckCircle,
    title: "Sends Confirmations",
    desc: "Automatically sends confirmations via SMS and email after every booking.",
    status: "No manual follow-ups",
    accent: "blue" as const,
  },
];

const verticals = [
  {
    icon: Heart,
    title: "Therapists",
    desc: "Book new patients and collect intake deposits.",
  },
  {
    icon: Scale,
    title: "Lawyers",
    desc: "Qualify leads, schedule consults, collect fees.",
  },
  {
    icon: Smile,
    title: "Dentists",
    desc: "Book appointments and answer insurance questions.",
    highlight: true,
    exampleSlug: "smilecare",
  },
  {
    icon: Wrench,
    title: "Plumbers",
    desc: "Capture calls, check availability, collect deposits.",
  },
];

const steps = [
  {
    title: "Call comes in",
    desc: "Your AI receptionist answers instantly, 24/7.",
  },
  {
    title: "AI handles it",
    desc: "Answers questions, books appointments, and more.",
  },
  {
    title: "Deposit collected",
    desc: "Sends payment link and collects the deposit.",
  },
  {
    title: "You're updated",
    desc: "Get confirmations and updates automatically.",
  },
];

const stats = [
  {
    icon: Phone,
    value: "12,843",
    label: "Calls answered",
    sub: "Never miss another opportunity.",
  },
  {
    icon: Calendar,
    value: "4,326",
    label: "Appointments booked",
    sub: "More bookings. Less back-and-forth.",
  },
  {
    icon: CreditCard,
    value: "$864,200",
    label: "Deposits collected",
    sub: "Secure payments. Fewer no-shows.",
  },
];

function SectionBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded-full border border-reception-purple/30 bg-reception-purple/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-reception-purple">
      {children}
    </span>
  );
}

export default function HomePage() {
  return (
    <>
      <LandingHeader />

      {/* Hero */}
      <section className="relative px-6 pb-24 pt-16">
        <div className="mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-2">
          <div>
            <SectionBadge>✦ AI front desk for solo professionals</SectionBadge>
            <h1 className="mt-6 text-4xl font-bold leading-tight md:text-5xl lg:text-[56px]">
              Turn every call into a{" "}
              <span className="gradient-text">booked client.</span>
            </h1>
            <p className="mt-6 text-lg text-slate-400">
              Reception.ai answers calls, books appointments, answers FAQs, and
              collects deposits through Stripe — 24/7.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="#pricing">
                <Button variant="gradient" size="lg">
                  Start free trial →
                </Button>
              </a>
              <a href="#how-it-works">
                <Button variant="outline" size="lg">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full border border-white/30">
                    <Play className="h-3 w-3 fill-white" />
                  </span>
                  See how it works
                </Button>
              </a>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                { icon: Zap, title: "Setup in minutes", sub: "No code. No hassle." },
                { icon: Shield, title: "Secure & trusted", sub: "Enterprise-grade security." },
                { icon: Clock, title: "Always on", sub: "Never miss a lead again." },
              ].map(({ icon: Icon, title, sub }) => (
                <div key={title} className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5">
                    <Icon className="h-4 w-4 text-reception-purple" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{title}</p>
                    <p className="text-xs text-slate-500">{sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-4 text-xs text-slate-500">
              <span className="uppercase tracking-wider">Trusted by teams using</span>
              <span className="font-semibold text-slate-300">ElevenLabs</span>
              <span className="font-semibold text-slate-300">Twilio</span>
              <span className="font-semibold text-slate-300">Stripe</span>
            </div>
          </div>
          <LiveCallCard />
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-24" id="features">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <SectionBadge>+ Everything your front desk does — automated</SectionBadge>
            <h2 className="mt-6 text-3xl font-bold md:text-4xl lg:text-5xl">
              AI that runs{" "}
              <span className="gradient-text">your front desk</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-400">
              Reception.ai handles every call, books appointments, answers questions,
              and collects payments — so you can focus on your work.
            </p>
          </div>

          <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, desc, status, accent }) => (
              <div
                key={title}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-white/15 hover:bg-white/[0.05]"
              >
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-full ${
                    accent === "purple"
                      ? "bg-reception-purple/20"
                      : "bg-reception-blue/20"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 ${
                      accent === "purple" ? "text-reception-purple" : "text-reception-blue"
                    }`}
                  />
                </div>
                <h3 className="mt-4 font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{desc}</p>
                <p className="mt-4 flex items-center gap-1.5 text-xs font-medium text-slate-500">
                  <CheckCircle className="h-3.5 w-3.5 text-soft-mint" />
                  {status}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="px-6 py-24" id="industries">
        <div className="mx-auto max-w-6xl rounded-3xl border border-white/10 bg-white/[0.02] p-8 md:p-12">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_2fr]">
            <div>
              <SectionBadge>✨ Built for solo professionals</SectionBadge>
              <h2 className="mt-6 text-3xl font-bold md:text-4xl">
                Built for{" "}
                <span className="gradient-text">your industry</span>
              </h2>
              <p className="mt-4 text-slate-400">
                Tailored to your world. Trained to sound like you.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {verticals.map(({ icon: Icon, title, desc, highlight, exampleSlug }) => (
                <Link
                  key={title}
                  href={exampleSlug ? clinicPath(exampleSlug) : "#"}
                  className={`group relative rounded-2xl border p-5 transition-all ${
                    highlight
                      ? "gradient-border marketing-glow bg-white/[0.05]"
                      : "border-white/10 bg-white/[0.03] hover:border-white/15"
                  } ${!exampleSlug ? "pointer-events-none opacity-60" : ""}`}
                >
                  {highlight && (
                    <span className="absolute -top-2.5 right-3 rounded-full gradient-bg px-2.5 py-0.5 text-[10px] font-bold uppercase text-white">
                      Popular
                    </span>
                  )}
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      highlight ? "gradient-bg" : "bg-white/10"
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${highlight ? "text-white" : "text-reception-purple"}`} />
                  </div>
                  <h3 className="mt-4 font-semibold text-white">{title}</h3>
                  <p className="mt-2 text-sm text-slate-400">{desc}</p>
                  {exampleSlug && (
                    <p className="mt-3 text-xs font-medium text-reception-purple group-hover:underline">
                      View example →
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works + Stats */}
      <section className="px-6 py-24" id="how-it-works">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <SectionBadge>How it works</SectionBadge>
            <h2 className="mt-6 text-3xl font-bold md:text-4xl">
              Simple for you.{" "}
              <span className="gradient-text">Powerful for your clients.</span>
            </h2>
          </div>

          <div className="relative mt-16">
            <div className="absolute left-0 right-0 top-5 hidden h-0.5 gradient-bg md:block" />
            <div className="grid gap-8 md:grid-cols-4">
              {steps.map((step, i) => (
                <div key={step.title} className="relative text-center">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full gradient-bg text-sm font-bold text-white">
                    {i + 1}
                  </div>
                  <h3 className="mt-4 font-semibold text-white">{step.title}</h3>
                  <p className="mt-2 text-sm text-slate-400">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-20 grid gap-8 sm:grid-cols-3">
            {stats.map(({ icon: Icon, value, label, sub }) => (
              <div key={label} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-reception-purple/20">
                  <Icon className="h-5 w-5 text-reception-purple" />
                </div>
                <p className="mt-4 text-4xl font-bold gradient-text">{value}</p>
                <p className="mt-1 font-medium text-white">{label}</p>
                <p className="mt-1 text-sm text-slate-500">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations strip */}
      <section className="border-y border-white/5 px-6 py-10" id="integrations">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-8 text-sm text-slate-500">
          <span className="uppercase tracking-wider">Powered by</span>
          <span className="font-semibold text-slate-300">Stripe</span>
          <span className="font-semibold text-slate-300">Twilio</span>
          <span className="font-semibold text-slate-300">ElevenLabs</span>
          <span className="font-semibold text-slate-300">OpenAI</span>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-6 py-24" id="pricing">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <SectionBadge>✦ Transparent pricing</SectionBadge>
            <h2 className="mt-6 text-3xl font-bold md:text-4xl">
              Simple pricing that{" "}
              <span className="gradient-text">scales with your calls</span>
            </h2>
            <p className="mt-4 text-slate-400">
              Start free. Upgrade anytime. Cancel anytime.
            </p>
          </div>
          <div className="mt-16">
            <PricingTable />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24">
        <div className="gradient-border marketing-glow mx-auto max-w-6xl overflow-hidden rounded-3xl bg-white/[0.03] p-8 md:p-12">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <SectionBadge>✦ 14-day free trial</SectionBadge>
              <h2 className="mt-6 text-3xl font-bold md:text-4xl">
                Turn every call into a{" "}
                <span className="gradient-text">booked client.</span>
              </h2>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex -space-x-2">
                  {["A", "B", "C", "D"].map((initial) => (
                    <div
                      key={initial}
                      className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-deep-navy gradient-bg text-xs font-semibold text-white"
                    >
                      {initial}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-slate-400">
                  Trusted by <span className="font-semibold text-white">7,500+</span> solo
                  professionals
                </p>
              </div>
            </div>

            <div>
              <p className="text-slate-400">
                Join thousands of solo professionals who never miss a lead — and get
                more done with AI on your team.
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                <Link href="/login">
                  <Button variant="gradient" size="lg">
                    Start your free trial →
                  </Button>
                </Link>
                <a href="#how-it-works">
                  <Button variant="outline" size="lg">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full border border-white/30">
                      <Play className="h-3 w-3 fill-white" />
                    </span>
                    See how it works
                  </Button>
                </a>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-6 border-t border-white/10 pt-8">
            <div className="flex flex-wrap gap-6">
              {[
                { icon: Award, label: "SOC 2 Type II Certified" },
                { icon: Lock, label: "256-bit SSL Encryption" },
                { icon: Shield, label: "GDPR Compliant" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-xs text-slate-400">
                  <Icon className="h-4 w-4 text-reception-purple" />
                  {label}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span className="uppercase tracking-wider">Powered by</span>
              <span className="font-semibold text-slate-300">Stripe</span>
              <span className="font-semibold text-slate-300">Twilio</span>
              <span className="font-semibold text-slate-300">OpenAI</span>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/5 px-6 py-8 text-center text-sm text-slate-500">
        <p>Reception.ai — AI receptionist infrastructure for solo professionals.</p>
        <p className="mt-1 text-xs text-slate-600">
          ElevenLabs × Stripe Hackathon · #ElevenHacks
        </p>
      </footer>
    </>
  );
}
