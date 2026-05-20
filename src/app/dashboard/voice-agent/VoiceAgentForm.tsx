"use client";

import { Button } from "@/components/ui/button";

type Tenant = {
  id: string;
  name: string;
  greeting: string | null;
  voiceId: string | null;
  elevenLabsAgentId: string | null;
  address: string | null;
};

export function VoiceAgentForm({
  tenant,
  faqs,
}: {
  tenant: Tenant;
  faqs: Array<{ question: string; answer: string }>;
  hours: Array<{ dayOfWeek: number; enabled: boolean | null; startTime: string | null; endTime: string | null }>;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Voice Agent</h1>
          <p className="text-slate-gray">Configure greeting, voice, and FAQs.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => window.open("/demo/smilecare", "_blank")}>
            Test my agent
          </Button>
          <Button>Save changes</Button>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <label className="text-sm font-medium">Greeting</label>
            <textarea
              className="mt-2 w-full rounded-lg border border-slate-200 p-3 text-sm"
              rows={4}
              defaultValue={tenant.greeting ?? ""}
            />
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <label className="text-sm font-medium">Voice</label>
            <select className="mt-2 w-full rounded-lg border border-slate-200 p-3 text-sm" defaultValue={tenant.voiceId ?? "sarah"}>
              <option value="sarah">Sarah (Friendly)</option>
              <option value="professional">Professional</option>
              <option value="warm">Warm</option>
            </select>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="font-medium">FAQs</h3>
            <ul className="mt-4 space-y-3 text-sm">
              {faqs.map((f, i) => (
                <li key={i} className="border-b pb-3 last:border-0">
                  <p className="font-medium">{f.question}</p>
                  <p className="text-slate-gray">{f.answer}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-deep-navy p-6 text-white">
          <h3 className="font-medium">Preview Agent</h3>
          <div className="mt-4 space-y-3 text-sm">
            <p className="rounded-lg bg-white/10 p-3">{tenant.greeting}</p>
            <p className="rounded-lg bg-reception-blue/30 p-3 text-right">
              I&apos;d like to book an appointment for tooth pain.
            </p>
            <p className="rounded-lg bg-white/10 p-3">
              I understand. I recommend Dr. Ana Martínez. Does Thursday at 10:30 work for you?
            </p>
          </div>
          <p className="mt-4 text-xs text-slate-400">
            Agent ID: {tenant.elevenLabsAgentId || "Set NEXT_PUBLIC_ELEVENLABS_AGENT_ID"}
          </p>
        </div>
      </div>
    </div>
  );
}
