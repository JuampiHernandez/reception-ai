import { cn } from "@/lib/utils";

const styles: Record<string, string> = {
  confirmed: "bg-emerald-100 text-emerald-700",
  paid: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700",
  pending_payment: "bg-amber-100 text-amber-700",
  held: "bg-blue-100 text-blue-700",
  none: "bg-slate-100 text-slate-600",
};

export function StatusBadge({ status }: { status: string }) {
  const label = status.replace(/_/g, " ");
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
        styles[status] ?? styles.none
      )}
    >
      {label}
    </span>
  );
}
