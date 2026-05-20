import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar } from "lucide-react";
import { getTenantBySlug } from "@/lib/tenant";
import { getPatientAppointments, getPatientAppointmentsByEmail } from "@/lib/clinic-data";
import { getPatientUser } from "@/lib/supabase/server";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { StatusBadge } from "@/components/brand/StatusBadge";
import { Button } from "@/components/ui/button";
import { clinicPath } from "@/lib/routes";
import { ClinicPageShell, ClinicCard } from "@/components/clinic/ClinicPageShell";
import { PayDepositButton } from "@/components/clinic/PayDepositButton";

export default async function AppointmentsPage({
  params,
  searchParams,
}: {
  params: Promise<{ tenant: string }>;
  searchParams: Promise<{ phone?: string }>;
}) {
  const { tenant: slug } = await params;
  const { phone } = await searchParams;
  const tenant = await getTenantBySlug(slug);
  if (!tenant) notFound();

  const patientUser = await getPatientUser();
  const emailAppointments = patientUser?.email
    ? await getPatientAppointmentsByEmail(tenant.id, patientUser.email)
    : [];
  const phoneAppointments = phone ? await getPatientAppointments(tenant.id, phone) : [];
  const appointments =
    emailAppointments.length > 0 ? emailAppointments : phoneAppointments;

  return (
    <ClinicPageShell
      slug={slug}
      title="My appointments"
      description="View upcoming visits and pay any pending deposits."
    >
      {patientUser?.email ? (
        <ClinicCard className="mb-4 border-teal-100 bg-teal-50/50 py-4 text-sm text-slate-700">
          Showing appointments for <strong>{patientUser.email}</strong>.{" "}
          <Link href={clinicPath(slug, "login")} className="font-medium text-teal-700 hover:underline">
            Not you?
          </Link>
        </ClinicCard>
      ) : (
        <ClinicCard className="mb-4">
          <p className="text-sm text-slate-600">
            Enter the phone number you used when booking, or{" "}
            <Link href={clinicPath(slug, "login")} className="font-medium text-teal-700 hover:underline">
              sign in with email
            </Link>
            .
          </p>
          <form method="get" className="mt-4 flex flex-wrap gap-3">
            <input
              type="tel"
              name="phone"
              defaultValue={phone ?? ""}
              placeholder="+54 11 5555-1234"
              className="min-w-[200px] flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-100"
            />
            <Button type="submit" className="bg-teal-600 hover:bg-teal-700">
              Look up
            </Button>
          </form>
        </ClinicCard>
      )}

      {phone && !patientUser && appointments.length === 0 && (
        <ClinicCard className="text-sm text-slate-600">
          No appointments found for <strong>{phone}</strong>. Book one with our AI receptionist on
          the{" "}
          <Link href={clinicPath(slug)} className="font-medium text-teal-700 hover:underline">
            home page
          </Link>
          .
        </ClinicCard>
      )}

      {patientUser && appointments.length === 0 && (
        <ClinicCard className="text-sm text-slate-600">
          No appointments yet. Book with our AI receptionist and share your email during the call.
        </ClinicCard>
      )}

      {appointments.length > 0 && (
        <ul className="space-y-4">
          {appointments.map((a) => (
            <li key={a.id}>
              <ClinicCard>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-100 text-teal-700">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">
                        {a.service?.name ?? "Appointment"}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        {a.doctor?.name} · {a.slot ? formatDateTime(a.slot.startsAt) : "TBD"}
                      </p>
                      {a.reason && <p className="mt-2 text-sm text-slate-500">{a.reason}</p>}
                    </div>
                  </div>
                  <StatusBadge status={a.status} />
                </div>
                {a.amountCents != null && (
                  <p className="mt-3 text-xs text-slate-500">
                    Deposit: {formatCurrency(a.amountCents)}
                  </p>
                )}
                {a.status === "pending_payment" && (
                  <PayDepositButton appointmentId={a.id} />
                )}
              </ClinicCard>
            </li>
          ))}
        </ul>
      )}
    </ClinicPageShell>
  );
}
