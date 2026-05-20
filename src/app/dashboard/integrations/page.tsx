import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { isStripeConfigured } from "@/lib/stripe";

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
      <h1 className="text-2xl font-bold">Integrations</h1>
      <div className="mt-8 grid gap-4">
        {integrations.map((i) => (
          <div
            key={i.name}
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-6"
          >
            <div>
              <p className="font-semibold">{i.name}</p>
              <p className="text-sm text-slate-gray">{i.desc}</p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm">{i.status}</span>
          </div>
        ))}
      </div>
      <p className="mt-6 text-sm text-slate-gray">
        Tool API base: {process.env.NEXT_PUBLIC_APP_URL}/api/tools/{session.tenant.slug}/
      </p>
    </div>
  );
}
