import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { getTenantAppointments } from "@/lib/dashboard-data";
import { DashboardPageHeader, DashboardCard } from "@/components/dashboard/DashboardShell";

export default async function ContactsPage() {
  const session = await getSessionUser();
  if (!session?.tenant) redirect("/login");
  const appointments = await getTenantAppointments(session.tenant.id);
  const contacts = appointments
    .filter((a) => a.patientName)
    .map((a) => ({
      name: a.patientName!,
      phone: a.patientPhone,
      email: a.patientEmail,
      lastVisit: a.slot?.startsAt,
    }));

  const unique = Array.from(
    new Map(contacts.map((c) => [c.name + (c.phone ?? "") + (c.email ?? ""), c])).values()
  );

  return (
    <div>
      <DashboardPageHeader
        title="Contacts"
        description="Patients from booked appointments."
      />
      <div className="mt-8 space-y-3">
        {unique.map((c, i) => (
          <DashboardCard key={i} className="!p-4">
            <p className="font-semibold text-slate-900">{c.name}</p>
            <p className="text-sm text-slate-600">{c.phone ?? "—"}</p>
            {c.email && <p className="text-sm text-slate-500">{c.email}</p>}
          </DashboardCard>
        ))}
        {unique.length === 0 && (
          <DashboardCard>
            <p className="text-sm text-slate-600">No contacts yet.</p>
          </DashboardCard>
        )}
      </div>
    </div>
  );
}
