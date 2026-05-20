import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { getTenantAppointments } from "@/lib/dashboard-data";

export default async function ContactsPage() {
  const session = await getSessionUser();
  if (!session?.tenant) redirect("/login");
  const appointments = await getTenantAppointments(session.tenant.id);
  const contacts = appointments
    .filter((a) => a.patientName)
    .map((a) => ({
      name: a.patientName!,
      phone: a.patientPhone,
      lastVisit: a.slot?.startsAt,
    }));

  const unique = Array.from(
    new Map(contacts.map((c) => [c.name + c.phone, c])).values()
  );

  return (
    <div>
      <h1 className="text-2xl font-bold">Contacts</h1>
      <p className="text-slate-gray">Patients from booked appointments.</p>
      <div className="mt-8 space-y-3">
        {unique.map((c, i) => (
          <div key={i} className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="font-medium">{c.name}</p>
            <p className="text-sm text-slate-gray">{c.phone ?? "—"}</p>
          </div>
        ))}
        {unique.length === 0 && (
          <p className="text-slate-gray">No contacts yet.</p>
        )}
      </div>
    </div>
  );
}
