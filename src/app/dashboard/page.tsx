import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { getDashboardStats, getTenantCalls } from "@/lib/dashboard-data";
import { MetricCard } from "@/components/brand/MetricCard";
import { RecentCallsTable } from "@/components/dashboard/RecentCallsTable";
import { SoundWaveVisualizer } from "@/components/brand/SoundWaveVisualizer";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { clinicPath } from "@/lib/routes";
import { DashboardPageHeader, DashboardCard } from "@/components/dashboard/DashboardShell";

export default async function DashboardPage() {
  const session = await getSessionUser();
  if (!session?.tenant) redirect("/login");

  const stats = await getDashboardStats(session.tenant.id);
  const calls = await getTenantCalls(session.tenant.id, 10);

  return (
    <div>
      <DashboardPageHeader
        title="Dashboard"
        description="Overview of your AI receptionist activity and performance."
        action={
          <span className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-sm font-medium text-teal-800">
            <span className="h-2 w-2 rounded-full bg-teal-500" />
            AI Agent Online
          </span>
        }
      />

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Calls Answered" value={String(stats.callsAnswered)} change="+28%" />
        <MetricCard label="Appointments Booked" value={String(stats.appointmentsBooked)} change="+16%" />
        <MetricCard label="Deposits Collected" value={formatCurrency(stats.depositsCollected)} change="+24%" />
        <MetricCard label="Revenue Saved" value={formatCurrency(stats.revenueSaved)} change="+31%" />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <DashboardCard className="overflow-hidden !p-0" title="Recent calls">
            <RecentCallsTable calls={calls} />
          </DashboardCard>
        </div>
        <DashboardCard className="border-teal-100 bg-gradient-to-br from-teal-600 to-teal-700 !p-0 text-white">
          <div className="p-6">
            <p className="text-sm text-teal-100">Live call activity</p>
            <p className="mt-2 font-semibold">AI agent is listening…</p>
            <SoundWaveVisualizer className="my-6 justify-center [&_div]:bg-white/80" />
            <Link href={clinicPath(session.tenant.slug)}>
              <Button
                variant="outline"
                size="sm"
                className="w-full border-white/30 bg-white/10 text-white hover:bg-white/20"
              >
                View customer site
              </Button>
            </Link>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}
