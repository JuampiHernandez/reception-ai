import { cn } from "@/lib/utils";
import { TrendingUp } from "lucide-react";

export function MetricCard({
  label,
  value,
  change,
  className,
}: {
  label: string;
  value: string;
  change?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm",
        className
      )}
    >
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
      {change && (
        <p className="mt-1 flex items-center gap-1 text-sm font-medium text-teal-600">
          <TrendingUp className="h-4 w-4" />
          {change}
        </p>
      )}
    </div>
  );
}
