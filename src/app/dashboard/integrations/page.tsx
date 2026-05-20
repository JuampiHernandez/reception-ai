import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { isStripeConfigured } from "@/lib/stripe";
import { DashboardPageHeader, DashboardCard } from "@/components/dashboard/DashboardShell";

export default async function IntegrationsPage() {
  const session = await getSessionUser();
  if (!session?.tenant) redirect("/login");

  const integrations = [
    {
      name: "ElevenLabs",
      status: process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID ? "Connected" : "Configure agent ID",
      desc: "Conversational AI voice agent",
    },
    {
      name: "Stripe",
      status: isStripeConfigured() ? "Connected" : "Test mode (mock payments)",
      desc: "Appointment deposits & subscriptions",
    },
    {
      name: "Twilio",
      status: process.env.TWILIO_PHONE_NUMBER ? "Connected" : "Optional — see docs",
      desc: "Inbound phone calls",
    },
  ];

  return (
    <div>
      <DashboardPageHeader
        title="Integrations"
        description="Services connected to your AI receptionist."
      />
      <div className="mt-8 grid gap-4">
        {integrations.map((i) => (
          <DashboardCard key={i.name} className="!p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-slate-900">{i.name}</p>
                <p className="text-sm text-slate-600">{i.desc}</p>
              </div>
              <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                {i.status}
              </span>
            </div>
          </DashboardCard>
        ))}
      </div>
      <p className="mt-6 text-sm text-slate-500">
        Tool API base: {process.env.NEXT_PUBLIC_APP_URL}/api/tools/{session.tenant.slug}/
      </p>
    </div>
  );
}
