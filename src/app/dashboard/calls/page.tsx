import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { getTenantCalls } from "@/lib/dashboard-data";
import { RecentCallsTable } from "@/components/dashboard/RecentCallsTable";
import { DashboardPageHeader, DashboardCard } from "@/components/dashboard/DashboardShell";

export default async function CallsPage() {
  const session = await getSessionUser();
  if (!session?.tenant) redirect("/login");
  const calls = await getTenantCalls(session.tenant.id, 50);

  return (
    <div>
      <DashboardPageHeader
        title="Calls"
        description="All conversations handled by your AI agent."
      />
      <DashboardCard className="mt-8 overflow-hidden !p-0">
        <RecentCallsTable calls={calls} />
      </DashboardCard>
    </div>
  );
}
