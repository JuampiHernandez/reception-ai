import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { getDashboardStats, getTenantPayments } from "@/lib/dashboard-data";
import { MetricCard } from "@/components/brand/MetricCard";
import { formatCurrency } from "@/lib/utils";
import { isStripeConfigured } from "@/lib/stripe";
import { DashboardPageHeader, DashboardCard } from "@/components/dashboard/DashboardShell";

export default async function PaymentsPage() {
  const session = await getSessionUser();
  if (!session?.tenant) redirect("/login");
  const stats = await getDashboardStats(session.tenant.id);
  const events = await getTenantPayments(session.tenant.id);
  const stripeOk = isStripeConfigured();

  return (
    <div>
      <DashboardPageHeader
        title="Payments"
        description="Deposits and payment links from voice bookings."
      />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Total deposits" value={formatCurrency(stats.depositsCollected)} />
        <MetricCard label="Collected (90d)" value={formatCurrency(stats.depositsCollected)} change="+24%" />
        <MetricCard label="Pending" value="$0" />
        <MetricCard
          label="Links sent"
          value={String(events.filter((e) => e.type === "payment_link_sent").length)}
        />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <DashboardCard className="lg:col-span-2 overflow-hidden !p-0" title="Payment events">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-100 bg-slate-50/80 text-left text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 font-medium">Type</th>
                  <th className="px-5 py-3 font-medium">Amount</th>
                  <th className="px-5 py-3 font-medium">Description</th>
                </tr>
              </thead>
              <tbody>
                {events.map((e) => (
                  <tr key={e.id} className="border-b border-slate-50 last:border-0">
                    <td className="px-5 py-3 text-slate-700">
                      {e.createdAt?.toLocaleDateString() ?? "—"}
                    </td>
                    <td className="px-5 py-3 capitalize text-slate-700">
                      {e.type.replace(/_/g, " ")}
                    </td>
                    <td className="px-5 py-3 font-medium text-slate-900">
                      {e.amountCents ? formatCurrency(e.amountCents) : "—"}
                    </td>
                    <td className="px-5 py-3 text-slate-600">{e.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DashboardCard>
        <DashboardCard>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-[#635BFF]">stripe</span>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                stripeOk ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
              }`}
            >
              {stripeOk ? "Connected" : "Test mode"}
            </span>
          </div>
          <p className="mt-4 text-sm text-slate-600">
            Deposits collected via Stripe Checkout. Never capture card data over voice.
          </p>
        </DashboardCard>
      </div>
    </div>
  );
}
