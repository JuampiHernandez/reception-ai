import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, MessageCircle } from "lucide-react";
import { VoiceReception } from "@/components/clinic/VoiceReception";
import { PatientAuthBanner } from "@/components/clinic/PatientAuthBanner";
import { getPatientUser } from "@/lib/supabase/server";
import { getTenantBySlug } from "@/lib/tenant";
import { clinicPath } from "@/lib/routes";
import { Button } from "@/components/ui/button";

export default async function ClinicHomePage({
  params,
  searchParams,
}: {
  params: Promise<{ tenant: string }>;
  searchParams: Promise<{ cancelled?: string }>;
}) {
  const { tenant: slug } = await params;
  const { cancelled } = await searchParams;
  const tenant = await getTenantBySlug(slug);
  if (!tenant) notFound();

  const agentId =
    tenant.elevenLabsAgentId ||
    process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID ||
    "placeholder";

  const patientUser = await getPatientUser();

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      {cancelled === "1" && (
        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Payment was cancelled. You can book again anytime using the voice assistant below.
        </div>
      )}

      <div className="text-center">
        <p className="text-sm font-medium text-teal-700">Welcome</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">{tenant.name}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-slate-600">
          {tenant.greeting ??
            "Talk to our AI receptionist to book an appointment, ask about services, or check availability."}
        </p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-700">
              <MessageCircle className="h-4 w-4 text-teal-600" />
              Talk to our AI receptionist
            </div>
            <PatientAuthBanner slug={slug} email={patientUser?.email ?? null} />
            <div className="mt-4">
              {agentId && agentId !== "placeholder" && agentId.startsWith("agent_") ? (
                <VoiceReception agentId={agentId} />
              ) : (
                <p className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
                  Set <code className="rounded bg-amber-100 px-1">NEXT_PUBLIC_ELEVENLABS_AGENT_ID</code> in
                  .env.local to enable voice booking.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <Calendar className="h-6 w-6 text-teal-600" />
            <h2 className="mt-3 font-semibold text-slate-900">Already booked?</h2>
            <p className="mt-2 text-sm text-slate-600">
              Look up your appointments by phone number.
            </p>
            <Link href={clinicPath(slug, "appointments")} className="mt-4 block">
              <Button variant="outline" className="w-full">
                View my appointments
              </Button>
            </Link>
          </div>

          <div className="rounded-xl border border-teal-100 bg-teal-50 p-6 text-sm text-slate-700">
            <h3 className="font-semibold text-slate-900">How to book</h3>
            <ol className="mt-3 list-decimal space-y-2 pl-5">
              <li>Start a voice chat above</li>
              <li>Describe your reason for visiting</li>
              <li>Pick an available time slot</li>
              <li>Pay your deposit — tap the link in the live transcript, or sign in to pay later</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
