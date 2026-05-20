import { CheckCircle2 } from "lucide-react";
import { SoundWaveVisualizer } from "./SoundWaveVisualizer";
import { StripePaymentToast } from "./StripePaymentToast";

export function LiveCallCard({
  caller = "María G.",
  phone = "+54 11 5555-1234",
  reason = "Urgent consultation — tooth pain",
  deposit = "$50 paid",
}: {
  caller?: string;
  phone?: string;
  reason?: string;
  deposit?: string;
}) {
  return (
    <div className="relative">
      <div className="absolute -inset-4 opacity-30">
        <SoundWaveVisualizer className="h-24 w-full justify-center" />
      </div>
      <div className="relative rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-reception-blue text-lg font-semibold text-white">
            {caller.charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-white">{caller}</p>
            <p className="text-sm text-slate-400">{phone}</p>
          </div>
          <span className="ml-auto rounded-full bg-emerald-500/20 px-2 py-1 text-xs text-soft-mint">
            Live call
          </span>
        </div>
        <div className="space-y-2 text-sm">
          <p>
            <span className="text-slate-400">Reason:</span>{" "}
            <span className="text-white">{reason}</span>
          </p>
          <p>
            <span className="text-slate-400">AI Action:</span>{" "}
            <span className="text-white">Booked appointment</span>
          </p>
          <p>
            <span className="text-slate-400">Deposit:</span>{" "}
            <span className="font-medium text-soft-mint">{deposit}</span>
          </p>
        </div>
        <div className="mt-4 flex items-center gap-2 text-soft-mint">
          <CheckCircle2 className="h-5 w-5" />
          <span className="font-semibold">Confirmed</span>
        </div>
      </div>
      <div className="relative -mt-2 ml-4">
        <StripePaymentToast amount="$50 deposit paid" />
      </div>
    </div>
  );
}
