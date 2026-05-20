import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { getTenantAppointments } from "@/lib/dashboard-data";
import { StatusBadge } from "@/components/brand/StatusBadge";
import { formatDateTime, formatCurrency } from "@/lib/utils";
import { DashboardPageHeader, DashboardCard } from "@/components/dashboard/DashboardShell";

export default async function BookingsPage() {
  const session = await getSessionUser();
  if (!session?.tenant) redirect("/login");
  const appointments = await getTenantAppointments(session.tenant.id);

  return (
    <div>
      <DashboardPageHeader
        title="Bookings"
        description="Appointments scheduled by your AI receptionist."
      />
      <div className="mt-8 space-y-3">
        {appointments.map((a) => (
          <DashboardCard key={a.id} className="!p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-slate-900">{a.patientName ?? "Walk-in caller"}</p>
                <p className="text-sm text-slate-600">
                  {a.doctor?.name} · {a.service?.name}
                </p>
                {a.slot && (
                  <p className="text-sm text-slate-500">{formatDateTime(a.slot.startsAt)}</p>
                )}
              </div>
              <div className="text-right">
                <StatusBadge status={a.status} />
                {a.amountCents && (
                  <p className="mt-1 text-sm font-medium text-slate-700">
                    {formatCurrency(a.amountCents)}
                  </p>
                )}
                {a.paymentUrl && (
                  <a
                    href={a.paymentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 block text-xs font-medium text-teal-700 hover:underline"
                  >
                    Stripe checkout
                  </a>
                )}
              </div>
            </div>
          </DashboardCard>
        ))}
        {appointments.length === 0 && (
          <DashboardCard>
            <p className="text-sm text-slate-600">No appointments yet. Try the live demo.</p>
          </DashboardCard>
        )}
      </div>
    </div>
  );
}
