import { StatusBadge } from "@/components/brand/StatusBadge";
import { formatCurrency } from "@/lib/utils";

export type CallRow = {
  id: string;
  callerName: string | null;
  reason: string | null;
  booked: boolean | null;
  depositCents: number | null;
  depositStatus: string | null;
  createdAt: Date | null;
};

export function RecentCallsTable({ calls }: { calls: CallRow[] }) {
  return (
    <div className="overflow-hidden">
      <table className="w-full text-sm">
        <thead className="border-b border-slate-100 bg-slate-50/80 text-left text-slate-500">
          <tr>
            <th className="px-4 py-3 font-medium">Caller</th>
            <th className="px-4 py-3 font-medium">Reason</th>
            <th className="px-4 py-3 font-medium">Booked</th>
            <th className="px-4 py-3 font-medium">Deposit</th>
            <th className="px-4 py-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {calls.map((c) => (
            <tr key={c.id} className="border-b last:border-0">
              <td className="px-4 py-3 font-medium">{c.callerName ?? "Unknown"}</td>
              <td className="px-4 py-3 text-slate-600">{c.reason ?? "—"}</td>
              <td className="px-4 py-3">{c.booked ? "Yes" : "No"}</td>
              <td className="px-4 py-3">
                {c.depositCents
                  ? `${formatCurrency(c.depositCents)} ${c.depositStatus === "paid" ? "paid" : "pending"}`
                  : "—"}
              </td>
              <td className="px-4 py-3">
                <StatusBadge
                  status={c.depositStatus === "paid" ? "confirmed" : "pending"}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
