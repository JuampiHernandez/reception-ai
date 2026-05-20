import { notFound } from "next/navigation";
import { VoiceReception } from "@/components/clinic/VoiceReception";
import { PatientAuthBanner } from "@/components/clinic/PatientAuthBanner";
import { getPatientUser } from "@/lib/supabase/server";
import { getTenantBySlug } from "@/lib/tenant";

export default async function ClinicHomePage({
  params,
  searchParams,
}: {
  params: Promise<{ tenant: string }>;
  searchParams: Promise<{ cancelled?: string; payment?: string }>;
}) {
  const { tenant: slug } = await params;
  const { cancelled, payment } = await searchParams;
  const tenant = await getTenantBySlug(slug);
  if (!tenant) notFound();

  const agentId =
    tenant.elevenLabsAgentId ||
    process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID ||
    "placeholder";

  const patientUser = await getPatientUser();

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      {cancelled === "1" && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Payment was cancelled. You can book again anytime using the voice assistant below.
        </div>
      )}
      {payment === "missing" && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
          We couldn&apos;t find that payment link. Book again or check your email for a valid link.
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
          How can I help you today?
        </h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          {tenant.greeting ??
            "Talk to our AI receptionist to book an appointment, ask about services, or check availability."}
        </p>
        <div className="mt-4">
          <PatientAuthBanner slug={slug} email={patientUser?.email ?? null} />
        </div>
      </div>

      {agentId && agentId !== "placeholder" && agentId.startsWith("agent_") ? (
        <VoiceReception agentId={agentId} slug={slug} />
      ) : (
        <p className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
          Set <code className="rounded bg-amber-100 px-1">NEXT_PUBLIC_ELEVENLABS_AGENT_ID</code> in
          .env.local to enable voice booking.
        </p>
      )}
    </div>
  );
}
