import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { getTenantCalls } from "@/lib/dashboard-data";
import { RecentCallsTable } from "@/components/dashboard/RecentCallsTable";

export default async function CallsPage() {
  const session = await getSessionUser();
  if (!session?.tenant) redirect("/login");
  const calls = await getTenantCalls(session.tenant.id, 50);

  return (
    <div>
      <h1 className="text-2xl font-bold">Calls</h1>
      <p className="text-slate-gray">All conversations handled by your AI agent.</p>
      <div className="mt-8">
        <RecentCallsTable calls={calls} />
      </div>
    </div>
  );
}
