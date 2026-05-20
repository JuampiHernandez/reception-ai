import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { getDashboardStats, getTenantCalls } from "@/lib/dashboard-data";
import { MetricCard } from "@/components/brand/MetricCard";
import { RecentCallsTable } from "@/components/dashboard/RecentCallsTable";
import { SoundWaveVisualizer } from "@/components/brand/SoundWaveVisualizer";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const session = await getSessionUser();
  if (!session?.tenant) redirect("/login");

  const stats = await getDashboardStats(session.tenant.id);
  const calls = await getTenantCalls(session.tenant.id, 10);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-deep-navy">Dashboard</h1>
          <p className="text-slate-gray">
            Overview of your AI receptionist activity and performance.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-soft-mint" />
          <span className="text-sm font-medium text-soft-mint">AI Agent Online</span>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Calls Answered" value={String(stats.callsAnswered)} change="+28%" />
        <MetricCard label="Appointments Booked" value={String(stats.appointmentsBooked)} change="+16%" />
        <MetricCard label="Deposits Collected" value={formatCurrency(stats.depositsCollected)} change="+24%" />
        <MetricCard label="Revenue Saved" value={formatCurrency(stats.revenueSaved)} change="+31%" />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-4 font-semibold">Recent Calls</h2>
          <RecentCallsTable calls={calls} />
        </div>
        <div className="rounded-xl bg-deep-navy p-6 text-white">
          <p className="text-sm text-slate-400">Live Call Activity</p>
          <p className="mt-2 font-semibold">AI Agent is listening...</p>
          <SoundWaveVisualizer className="my-6 justify-center" />
          <Link href="/demo/smilecare">
            <Button variant="outline" size="sm" className="w-full">
              View live demo
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
