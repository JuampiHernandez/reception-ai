import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { clinicPath } from "@/lib/routes";
import { DashboardPageHeader, DashboardCard } from "@/components/dashboard/DashboardShell";

export default async function SettingsPage() {
  const session = await getSessionUser();
  if (!session?.tenant) redirect("/login");
  const t = session.tenant;
  const siteUrl = (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000") + clinicPath(t.slug);

  return (
    <div>
      <DashboardPageHeader
        title="Settings"
        description="Your practice profile and patient-facing site."
      />
      <DashboardCard className="mt-8 max-w-lg">
        <dl className="space-y-5 text-sm">
          <div>
            <dt className="font-medium text-slate-500">Business name</dt>
            <dd className="mt-1 text-slate-900">{t.name}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-500">Slug / API tenant</dt>
            <dd className="mt-1 font-mono text-slate-900">{t.slug}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-500">Address</dt>
            <dd className="mt-1 text-slate-900">{t.address}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-500">Phone</dt>
            <dd className="mt-1 text-slate-900">{t.phone}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-500">Customer site</dt>
            <dd className="mt-1 break-all font-mono text-teal-700">{siteUrl}</dd>
            <pre className="mt-2 overflow-x-auto rounded-xl bg-slate-50 p-3 text-xs text-slate-700">
              {`<a href="${siteUrl}">Talk to our AI receptionist</a>`}
            </pre>
          </div>
        </dl>
      </DashboardCard>
    </div>
  );
}
