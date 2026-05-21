import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar } from "lucide-react";
import { getTenantBySlug } from "@/lib/tenant";
import { getPatientAppointments } from "@/lib/clinic-data";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { StatusBadge } from "@/components/brand/StatusBadge";
import { clinicPath } from "@/lib/routes";
import { getDefaultDialCode, formatPhoneDisplay } from "@/lib/phone";
import { ClinicPageShell, ClinicCard } from "@/components/clinic/ClinicPageShell";
import { PayDepositButton } from "@/components/clinic/PayDepositButton";
import { PhoneLookupForm } from "@/components/clinic/PhoneLookupForm";

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

  const appointments = phone ? await getPatientAppointments(tenant.id, phone) : [];
  const defaultDialCode = getDefaultDialCode(tenant.timezone);
  const phoneDisplay = phone ? formatPhoneDisplay(phone) : "";

  return (
    <ClinicPageShell
      slug={slug}
      title="My appointments"
      description="View upcoming visits and pay any pending deposits."
    >
      <ClinicCard className="mb-4">
        <p className="text-sm text-slate-600">
          Enter the phone number you used when booking to look up your appointments.
        </p>
        <PhoneLookupForm
          slug={slug}
          defaultDialCode={defaultDialCode}
          initialPhone={phone ?? ""}
          submitLabel="Look up"
          className="mt-4 max-w-md"
          inputClassName="rounded-xl"
        />
      </ClinicCard>

      {phone && appointments.length === 0 && (
        <ClinicCard className="text-sm text-slate-600">
          No appointments found for <strong>{phoneDisplay || phone}</strong>. Book one with our AI
          receptionist on the{" "}
          <Link href={clinicPath(slug)} className="font-medium text-teal-700 hover:underline">
            home page
          </Link>
          .
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
