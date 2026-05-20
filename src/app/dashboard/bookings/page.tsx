import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { getTenantAppointments } from "@/lib/dashboard-data";
import { StatusBadge } from "@/components/brand/StatusBadge";
import { formatDateTime, formatCurrency } from "@/lib/utils";

export default async function BookingsPage() {
  const session = await getSessionUser();
  if (!session?.tenant) redirect("/login");
  const appointments = await getTenantAppointments(session.tenant.id);

  return (
    <div>
      <h1 className="text-2xl font-bold">Bookings</h1>
      <p className="text-slate-gray">Appointments scheduled by your AI receptionist.</p>
      <div className="mt-8 space-y-4">
        {appointments.map((a) => (
          <div
            key={a.id}
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4"
          >
            <div>
              <p className="font-medium">{a.patientName ?? "Walk-in caller"}</p>
              <p className="text-sm text-slate-gray">
                {a.doctor?.name} · {a.service?.name}
              </p>
              {a.slot && (
                <p className="text-sm text-slate-gray">
                  {formatDateTime(a.slot.startsAt)}
                </p>
              )}
            </div>
            <div className="text-right">
              <StatusBadge status={a.status} />
              {a.amountCents && (
                <p className="mt-1 text-sm">{formatCurrency(a.amountCents)}</p>
              )}
              {a.paymentUrl && (
                <a
                  href={a.paymentUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-reception-blue hover:underline"
                >
                  Payment link
                </a>
              )}
            </div>
          </div>
        ))}
        {appointments.length === 0 && (
          <p className="text-slate-gray">No appointments yet. Try the live demo.</p>
        )}
      </div>
    </div>
  );
}
