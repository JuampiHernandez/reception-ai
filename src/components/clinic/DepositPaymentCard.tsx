"use client";

import { Shield, ArrowRight } from "lucide-react";
import { useClinicCheckout } from "./ClinicCheckoutHost";
import { appointmentIdFromPayUrl } from "./CheckoutModal";

export function DepositPaymentCard({
  amountDisplay,
  url,
  appointmentId: appointmentIdProp,
}: {
  amountDisplay?: string;
  url: string;
  appointmentId?: string;
}) {
  const { openCheckout } = useClinicCheckout();
  const appointmentId =
    appointmentIdProp ?? appointmentIdFromPayUrl(url) ?? null;

  function handlePay() {
    if (appointmentId) {
      openCheckout(appointmentId, { autoOpen: true });
      return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="mx-auto w-full max-w-sm rounded-xl border border-teal-100 bg-gradient-to-br from-teal-50/80 to-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-100 text-teal-700">
          <Shield className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-900">Deposit required</p>
          <p className="mt-0.5 text-xs text-slate-600">
            Secure your appointment with a deposit
          </p>
          {amountDisplay && (
            <p className="mt-2 text-lg font-bold text-teal-700">{amountDisplay}</p>
          )}
          <button
            type="button"
            onClick={handlePay}
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700"
          >
            Pay securely
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
