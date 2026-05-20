import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";

export default async function SettingsPage() {
  const session = await getSessionUser();
  if (!session?.tenant) redirect("/login");
  const t = session.tenant;

  return (
    <div>
      <h1 className="text-2xl font-bold">Settings</h1>
      <div className="mt-8 max-w-lg space-y-4 rounded-xl border border-slate-200 bg-white p-6">
        <div>
          <label className="text-sm font-medium">Business name</label>
          <p className="mt-1">{t.name}</p>
        </div>
        <div>
          <label className="text-sm font-medium">Slug / API tenant</label>
          <p className="mt-1 font-mono text-sm">{t.slug}</p>
        </div>
        <div>
          <label className="text-sm font-medium">Address</label>
          <p className="mt-1">{t.address}</p>
        </div>
        <div>
          <label className="text-sm font-medium">Phone</label>
          <p className="mt-1">{t.phone}</p>
        </div>
        <div>
          <label className="text-sm font-medium">Embed demo</label>
          <pre className="mt-2 overflow-x-auto rounded bg-slate-100 p-3 text-xs">
            {`<a href="${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/demo/${t.slug}">Talk to our AI receptionist</a>`}
          </pre>
        </div>
      </div>
    </div>
  );
}
