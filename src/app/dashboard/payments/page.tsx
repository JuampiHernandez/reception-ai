import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { getDashboardStats, getTenantPayments } from "@/lib/dashboard-data";
import { MetricCard } from "@/components/brand/MetricCard";
import { formatCurrency } from "@/lib/utils";
import { isStripeConfigured } from "@/lib/stripe";

export default async function PaymentsPage() {
  const session = await getSessionUser();
  if (!session?.tenant) redirect("/login");
  const stats = await getDashboardStats(session.tenant.id);
  const events = await getTenantPayments(session.tenant.id);
  const stripeOk = isStripeConfigured();

  return (
    <div>
      <h1 className="text-2xl font-bold">Payments</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Total deposits" value={formatCurrency(stats.depositsCollected)} />
        <MetricCard label="Collected (90d)" value={formatCurrency(stats.depositsCollected)} change="+24%" />
        <MetricCard label="Pending" value="$0" />
        <MetricCard label="Links sent" value={String(events.filter((e) => e.type === "payment_link_sent").length)} />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead className="border-b bg-slate-50 text-left text-slate-gray">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Description</th>
              </tr>
            </thead>
            <tbody>
              {events.map((e) => (
                <tr key={e.id} className="border-b">
                  <td className="px-4 py-3">
                    {e.createdAt?.toLocaleDateString() ?? "—"}
                  </td>
                  <td className="px-4 py-3 capitalize">{e.type.replace(/_/g, " ")}</td>
                  <td className="px-4 py-3">
                    {e.amountCents ? formatCurrency(e.amountCents) : "—"}
                  </td>
                  <td className="px-4 py-3 text-slate-gray">{e.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#635BFF]">stripe</span>
            <span className={`rounded-full px-2 py-1 text-xs ${stripeOk ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
              {stripeOk ? "Connected" : "Test mode"}
            </span>
          </div>
          <p className="mt-4 text-sm text-slate-gray">
            Deposits collected via Stripe Checkout. Never capture card data over voice.
          </p>
        </div>
      </div>
    </div>
  );
}
