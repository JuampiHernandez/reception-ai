import { CheckCircle2, Calendar, CreditCard } from "lucide-react";
import { SoundWaveVisualizer } from "./SoundWaveVisualizer";

const chatMessages = [
  { from: "Maria", text: "Hi, I have terrible tooth pain. Can I get an appointment?" },
  { from: "AI", text: "Of course! I have tomorrow at 10 AM available. Shall I book that for you?" },
  { from: "Maria", text: "Yes please, and do you take my insurance?" },
  { from: "AI", text: "Yes, we accept most plans. I'll send a $50 deposit link to confirm your spot." },
];

export function LiveCallCard({
  caller = "Maria G.",
  phone = "+1 555-0123",
  reason = "Urgent consultation — tooth pain",
  deposit = "$50 paid",
}: {
  caller?: string;
  phone?: string;
  reason?: string;
  deposit?: string;
}) {
  return (
    <div className="relative marketing-glow">
      <div className="absolute -inset-6 opacity-20">
        <SoundWaveVisualizer className="h-24 w-full justify-center" />
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl">
        <div className="flex items-center gap-2 border-b border-white/10 px-5 py-3">
          <SoundWaveVisualizer className="h-4" />
          <span className="text-xs font-semibold uppercase tracking-wider text-reception-purple">
            Live call
          </span>
        </div>

        <div className="grid lg:grid-cols-2">
          {/* Caller info panel */}
          <div className="border-b border-white/10 p-5 lg:border-b-0 lg:border-r">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full gradient-bg text-lg font-semibold text-white">
                {caller.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-white">{caller}</p>
                <p className="text-sm text-slate-400">{phone}</p>
              </div>
              <span className="ml-auto rounded-full bg-white/10 px-2.5 py-1 text-xs text-slate-300">
                Returning caller
              </span>
            </div>

            <div className="mt-5 space-y-2.5 text-sm">
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

          {/* Chat + status panel */}
          <div className="p-5">
            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-slate-400">
              AI Call Assistant
            </p>
            <div className="space-y-2.5 rounded-xl bg-black/30 p-3">
              {chatMessages.map((msg, i) => (
                <div key={i} className="text-xs leading-relaxed">
                  <span
                    className={`font-semibold ${
                      msg.from === "AI" ? "text-reception-purple" : "text-white"
                    }`}
                  >
                    {msg.from === "AI" ? "AI Receptionist" : msg.from}:
                  </span>{" "}
                  <span className="text-slate-300">{msg.text}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-2.5">
              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-reception-blue/20">
                  <Calendar className="h-4 w-4 text-reception-blue" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-white">Appointment booked</p>
                  <p className="text-xs text-slate-400">Tomorrow at 10:00 AM</p>
                </div>
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs text-soft-mint">
                  Confirmed
                </span>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#635BFF]/20">
                  <CreditCard className="h-4 w-4 text-[#635BFF]" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-white">Stripe payment</p>
                  <p className="text-xs text-slate-400">$50 deposit paid</p>
                </div>
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs text-soft-mint">
                  Payment successful
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
