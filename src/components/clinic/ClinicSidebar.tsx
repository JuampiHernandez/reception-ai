"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Sparkles,
  AlertCircle,
  CalendarClock,
  HelpCircle,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { clinicPath } from "@/lib/routes";

const QUICK_ACTIONS = [
  { icon: Sparkles, label: "Book cleaning", message: "I'd like to book a dental cleaning." },
  {
    icon: AlertCircle,
    label: "Emergency visit",
    message: "I need an urgent appointment — I'm in pain.",
  },
  {
    icon: CalendarClock,
    label: "Reschedule",
    message: "I need to reschedule an existing appointment.",
  },
  {
    icon: HelpCircle,
    label: "Ask a question",
    message: "I have a question about the clinic.",
  },
] as const;

export function ClinicSidebar({
  slug,
  onQuickAction,
}: {
  slug: string;
  onQuickAction?: (message: string) => void;
}) {
  const router = useRouter();
  const [phone, setPhone] = useState("");

  function handleFindAppointment(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = phone.trim();
    if (!trimmed) return;
    router.push(`${clinicPath(slug, "appointments")}?phone=${encodeURIComponent(trimmed)}`);
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-slate-900">Already booked?</h2>
        <p className="mt-1 text-sm text-slate-600">Look up your appointments by phone number.</p>
        <form onSubmit={handleFindAppointment} className="mt-4 space-y-3">
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+54 11 5555-1234"
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-100"
          />
          <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700">
            Find appointment
          </Button>
        </form>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-slate-900">Quick actions</h2>
        <ul className="mt-3 space-y-2">
          {QUICK_ACTIONS.map(({ icon: Icon, label, message }) => (
            <li key={label}>
              <button
                type="button"
                onClick={() => onQuickAction?.(message)}
                className="flex w-full items-center gap-3 rounded-lg border border-slate-100 px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:border-teal-200 hover:bg-teal-50/50"
              >
                <Icon className="h-4 w-4 shrink-0 text-teal-600" />
                {label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl border border-teal-100 bg-teal-50/60 p-5">
        <h2 className="font-semibold text-slate-900">How it works</h2>
        <ol className="mt-4 space-y-4">
          {[
            { step: 1, text: "Talk to our AI receptionist", icon: Sparkles },
            { step: 2, text: "Describe your reason for visiting", icon: HelpCircle },
            { step: 3, text: "Pick an available time slot", icon: Calendar },
            { step: 4, text: "Pay your deposit via email or the link below", icon: Lock },
          ].map(({ step, text, icon: Icon }) => (
            <li key={step} className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-600 text-xs font-bold text-white">
                {step}
              </span>
              <div className="flex items-start gap-2 pt-0.5">
                <Icon className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" />
                <span className="text-sm text-slate-700">{text}</span>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <p className="flex items-center gap-2 px-1 text-xs text-slate-500">
        <Lock className="h-3.5 w-3.5 shrink-0 text-slate-400" />
        Your data is secure and HIPAA-compliant.
      </p>
    </div>
  );
}
