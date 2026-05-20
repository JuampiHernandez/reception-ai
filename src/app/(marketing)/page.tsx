import Link from "next/link";
import {
  Phone,
  Calendar,
  HelpCircle,
  Send,
  CreditCard,
  CheckCircle,
  ArrowRight,
  Heart,
  Scale,
  Smile,
  Wrench,
} from "lucide-react";
import { LandingHeader } from "@/components/landing/Header";
import { LiveCallCard } from "@/components/brand/LiveCallCard";
import { PricingTable } from "@/components/landing/PricingTable";
import { Button } from "@/components/ui/button";
import { clinicPath } from "@/lib/routes";

const features = [
  { icon: Phone, title: "Answers Calls 24/7", desc: "Never miss a lead again" },
  { icon: Calendar, title: "Books Appointments", desc: "Syncs with your calendar" },
  { icon: HelpCircle, title: "Answers FAQs", desc: "Trained on your business" },
  { icon: Send, title: "Sends Payment Links", desc: "Secure Stripe checkout" },
  { icon: CreditCard, title: "Collects Deposits", desc: "Reduce no-shows" },
  { icon: CheckCircle, title: "Sends Confirmations", desc: "SMS and email alerts" },
];

const verticals = [
  { icon: Heart, title: "Therapists", desc: "Book new patients and collect intake deposits." },
  { icon: Scale, title: "Lawyers", desc: "Qualify leads, schedule consults, collect fees." },
  {
    icon: Smile,
    title: "Dentists",
    desc: "Book appointments, answer insurance questions.",
    highlight: true,
    exampleSlug: "smilecare",
  },
  { icon: Wrench, title: "Plumbers", desc: "Capture calls, check availability, collect deposits." },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <LandingHeader />

      <section className="bg-deep-navy px-6 py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <div>
            <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl lg:text-[56px]">
              Turn missed calls into{" "}
              <span className="text-soft-mint">booked appointments.</span>
            </h1>
            <p className="mt-6 text-lg text-slate-300">
              Reception.ai is an AI phone receptionist for solo professionals. It
              answers calls 24/7, books appointments, answers FAQs, and collects
              deposits through Stripe while you focus on your work.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="#pricing">
                <Button size="lg">View pricing →</Button>
              </a>
              <Link href={clinicPath("smilecare")}>
                <Button variant="outline" size="lg">
                  See a customer site
                </Button>
              </Link>
            </div>
            <p className="mt-8 text-xs text-slate-500">
              Built with{" "}
              <span className="text-slate-400">ElevenLabs · Twilio · Stripe</span>
            </p>
          </div>
          <LiveCallCard />
        </div>
      </section>

      <section className="border-b bg-white px-6 py-8" id="integrations">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-8 text-sm text-slate-gray">
          <span>Trusted by teams using</span>
          <span className="font-semibold text-deep-navy">ElevenLabs</span>
          <span className="font-semibold text-deep-navy">Twilio</span>
          <span className="font-semibold text-deep-navy">Stripe</span>
        </div>
      </section>

      <section className="px-6 py-20" id="features">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-semibold text-deep-navy">
            Everything your front desk does — automated
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <Icon className="h-8 w-8 text-reception-blue" />
                <h3 className="mt-4 font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-slate-gray">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-semibold">
            Built for solo professionals
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {verticals.map(({ icon: Icon, title, desc, highlight, exampleSlug }) => (
              <Link
                key={title}
                href={exampleSlug ? clinicPath(exampleSlug) : "#"}
                className={`rounded-xl border bg-white p-6 shadow-sm transition-shadow hover:shadow-md ${
                  highlight ? "border-reception-blue ring-2 ring-reception-blue/30" : "border-slate-200"
                } ${!exampleSlug ? "pointer-events-none opacity-60" : ""}`}
              >
                <Icon className="h-8 w-8 text-reception-blue" />
                <h3 className="mt-4 font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-slate-gray">{desc}</p>
                {exampleSlug && (
                  <p className="mt-3 text-xs font-medium text-reception-blue">View live example →</p>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-semibold">How it works</h2>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-4 text-sm font-medium">
            {["Call comes in", "AI handles it", "Deposit collected", "You're updated"].map(
              (step, i) => (
                <span key={step} className="flex items-center gap-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-reception-blue text-white">
                    {i + 1}
                  </span>
                  {step}
                  {i < 3 && <ArrowRight className="h-4 w-4 text-slate-gray" />}
                </span>
              )
            )}
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            <div>
              <p className="text-3xl font-bold text-reception-blue">12,843</p>
              <p className="text-slate-gray">Calls answered</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-reception-blue">4,326</p>
              <p className="text-slate-gray">Appointments booked</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-reception-blue">$864,200</p>
              <p className="text-slate-gray">Deposits collected</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-20" id="pricing">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-semibold">Simple pricing</h2>
          <p className="mt-2 text-center text-slate-gray">
            Start free. Upgrade when you&apos;re ready.
          </p>
          <div className="mt-12">
            <PricingTable />
          </div>
        </div>
      </section>

      <section className="bg-deep-navy px-6 py-20 text-center">
        <h2 className="text-3xl font-bold text-white">
          Ready to turn every call into a client?
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-slate-300">
          Set up your AI receptionist in minutes. Your customers get their own branded site
          with voice booking, payments, and appointment history.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href="/login">
            <Button size="lg">Get started →</Button>
          </Link>
          <a href="#pricing">
            <Button variant="outline" size="lg">
              Compare plans
            </Button>
          </a>
        </div>
      </section>

      <footer className="border-t px-6 py-8 text-center text-sm text-slate-gray">
        Reception.ai — ElevenLabs × Stripe Hackathon · #ElevenHacks
      </footer>
    </div>
  );
}
