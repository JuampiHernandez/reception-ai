import { notFound } from "next/navigation";
import Link from "next/link";
import { getTenantBySlug } from "@/lib/tenant";
import { getPatientAppointments, getPatientAppointmentsByEmail } from "@/lib/clinic-data";
import { getPatientUser } from "@/lib/supabase/server";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { StatusBadge } from "@/components/brand/StatusBadge";
import { Button } from "@/components/ui/button";
import { clinicPath } from "@/lib/routes";

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
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-2xl font-bold text-slate-900">My appointments</h1>

      {patientUser?.email ? (
        <p className="mt-2 text-slate-600">
          Showing appointments for <strong>{patientUser.email}</strong>.{" "}
          <Link href={clinicPath(slug, "login")} className="text-teal-700 hover:underline">
            Not you?
          </Link>
        </p>
      ) : (
        <>
          <p className="mt-2 text-slate-600">
            Enter the phone number you used when booking, or{" "}
            <Link href={clinicPath(slug, "login")} className="font-medium text-teal-700 hover:underline">
              sign in with email
            </Link>{" "}
            to see everything in one place.
          </p>

          <form method="get" className="mt-8 flex flex-wrap gap-3">
            <input
              type="tel"
              name="phone"
              defaultValue={phone ?? ""}
              placeholder="+54 11 5555-1234"
              className="min-w-[240px] flex-1 rounded-lg border border-slate-200 px-4 py-2 text-sm"
            />
            <Button type="submit">Look up</Button>
          </form>
        </>
      )}

      {phone && !patientUser && appointments.length === 0 && (
        <p className="mt-8 rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-600">
          No appointments found for <strong>{phone}</strong>. Book one using our AI receptionist on
          the home page.
        </p>
      )}

      {patientUser && appointments.length === 0 && (
        <p className="mt-8 rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-600">
          No appointments yet for this email. Book with our AI receptionist and share your email
          during the call.
        </p>
      )}

      {appointments.length > 0 && (
        <ul className="mt-8 space-y-4">
          {appointments.map((a) => (
            <li
              key={a.id}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-900">
                    {a.service?.name ?? "Appointment"}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    {a.doctor?.name} · {a.slot ? formatDateTime(a.slot.startsAt) : "TBD"}
                  </p>
                  {a.reason && <p className="mt-2 text-sm text-slate-500">{a.reason}</p>}
                </div>
                <StatusBadge status={a.status} />
              </div>
              {a.amountCents != null && (
                <p className="mt-3 text-xs text-slate-500">
                  Deposit: {formatCurrency(a.amountCents)}
                </p>
              )}
              {a.status === "pending_payment" && (
                <Link
                  href={clinicPath(slug, "pay") + `?appointment_id=${a.id}`}
                  className="mt-4 inline-flex rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
                >
                  Pay deposit now
                </Link>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
