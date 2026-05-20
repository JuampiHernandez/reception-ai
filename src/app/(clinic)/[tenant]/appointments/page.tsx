import { notFound } from "next/navigation";
import { getTenantBySlug } from "@/lib/tenant";
import { getPatientAppointments } from "@/lib/clinic-data";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { StatusBadge } from "@/components/brand/StatusBadge";
import { Button } from "@/components/ui/button";

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

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-2xl font-bold text-slate-900">My appointments</h1>
      <p className="mt-2 text-slate-600">
        Enter the phone number you used when booking to see your appointment history.
      </p>

      <form method="get" className="mt-8 flex flex-wrap gap-3">
        <input
          type="tel"
          name="phone"
          defaultValue={phone ?? ""}
          placeholder="+54 11 5555-1234"
          className="min-w-[240px] flex-1 rounded-lg border border-slate-200 px-4 py-2 text-sm"
          required
        />
        <Button type="submit">Look up</Button>
      </form>

      {phone && appointments.length === 0 && (
        <p className="mt-8 rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-600">
          No appointments found for <strong>{phone}</strong>. Book one using our AI receptionist on
          the home page.
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
                  {a.reason && (
                    <p className="mt-2 text-sm text-slate-500">{a.reason}</p>
                  )}
                </div>
                <StatusBadge status={a.status} />
              </div>
              {a.amountCents != null && (
                <p className="mt-3 text-xs text-slate-500">
                  Deposit: {formatCurrency(a.amountCents)}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
