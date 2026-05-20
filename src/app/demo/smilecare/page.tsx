import Link from "next/link";
import Image from "next/image";
import { ElevenLabsWidget } from "@/components/demo/ElevenLabsWidget";
import { Button } from "@/components/ui/button";

export default function SmileCareDemoPage() {
  const agentId =
    process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID || "placeholder";

  return (
    <div className="min-h-screen bg-deep-navy">
      <header className="border-b border-white/10 px-6 py-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.svg" alt="" width={32} height={32} />
            <span className="font-semibold text-white">Reception.ai</span>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" size="sm">
              Dashboard
            </Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="text-center">
          <p className="text-sm text-soft-mint">Live demo · Dental center</p>
          <h1 className="mt-2 text-3xl font-bold text-white">
            SmileCare Dental Center
          </h1>
          <p className="mt-4 text-slate-300">
            Talk to the AI receptionist. Book an appointment for tooth pain — it
            will recommend a doctor, offer a time slot, and send a Stripe payment link.
          </p>
        </div>

        <div className="mt-10 flex justify-center">
          <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6">
            <ElevenLabsWidget agentId={agentId} />
          </div>
        </div>

        <div className="mt-8 rounded-xl bg-white/5 p-6 text-sm text-slate-300">
          <h3 className="font-semibold text-white">Demo script</h3>
          <ol className="mt-4 list-decimal space-y-2 pl-5">
            <li>&quot;Hi, I&apos;d like an appointment. I have tooth pain on the right side.&quot;</li>
            <li>Respond to triage questions</li>
            <li>Accept offered slot (e.g. Thursday 10:30)</li>
            <li>Complete payment via Stripe link</li>
          </ol>
          <p className="mt-4">
            Login to dashboard: smilecare@demo.reception.ai / demo1234
          </p>
        </div>
      </main>
    </div>
  );
}
