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
        "rounded-xl border border-slate-200 bg-white p-5 shadow-sm",
        className
      )}
    >
      <p className="text-sm text-slate-gray">{label}</p>
      <p className="mt-2 text-2xl font-bold text-deep-navy">{value}</p>
      {change && (
        <p className="mt-1 flex items-center gap-1 text-sm text-soft-mint">
          <TrendingUp className="h-4 w-4" />
          {change}
        </p>
      )}
    </div>
  );
}
