"use client";

import { Button } from "@/components/ui/button";
import { clinicPath } from "@/lib/routes";
import { DashboardPageHeader, DashboardCard } from "@/components/dashboard/DashboardShell";

type Tenant = {
  id: string;
  slug: string;
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
      <DashboardPageHeader
        title="Voice Agent"
        description="Configure greeting, voice, and FAQs."
        action={
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => window.open(clinicPath(tenant.slug), "_blank")}
            >
              Test on customer site
            </Button>
            <Button className="bg-teal-600 hover:bg-teal-700">Save changes</Button>
          </div>
        }
      />

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <DashboardCard>
            <label className="text-sm font-medium text-slate-700">Greeting</label>
            <textarea
              className="mt-2 w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-100"
              rows={4}
              defaultValue={tenant.greeting ?? ""}
            />
          </DashboardCard>
          <DashboardCard>
            <label className="text-sm font-medium text-slate-700">Voice</label>
            <select
              className="mt-2 w-full rounded-xl border border-slate-200 p-3 text-sm"
              defaultValue={tenant.voiceId ?? "sarah"}
            >
              <option value="sarah">Sarah (Friendly)</option>
              <option value="professional">Professional</option>
              <option value="warm">Warm</option>
            </select>
          </DashboardCard>
          <DashboardCard>
            <h3 className="font-medium text-slate-900">FAQs</h3>
            <ul className="mt-4 space-y-3 text-sm">
              {faqs.map((f, i) => (
                <li key={i} className="border-b border-slate-100 pb-3 last:border-0">
                  <p className="font-medium text-slate-900">{f.question}</p>
                  <p className="text-slate-600">{f.answer}</p>
                </li>
              ))}
            </ul>
          </DashboardCard>
        </div>
        <DashboardCard className="border-teal-100 bg-gradient-to-br from-teal-700 to-teal-800 text-white">
          <h3 className="font-medium">Preview agent</h3>
          <div className="mt-4 space-y-3 text-sm">
            <p className="rounded-xl bg-white/10 p-3">{tenant.greeting}</p>
            <p className="rounded-xl bg-white/20 p-3 text-right">
              I&apos;d like to book an appointment for tooth pain.
            </p>
            <p className="rounded-xl bg-white/10 p-3">
              I understand. I recommend Dr. Ana Martínez. Does Thursday at 10:30 work for you?
            </p>
          </div>
          <p className="mt-4 text-xs text-teal-100">
            Agent ID: {tenant.elevenLabsAgentId || "Set NEXT_PUBLIC_ELEVENLABS_AGENT_ID"}
          </p>
        </DashboardCard>
      </div>
    </div>
  );
}
