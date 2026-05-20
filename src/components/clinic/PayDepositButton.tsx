"use client";

import { ArrowRight } from "lucide-react";
import { useClinicCheckout } from "./ClinicCheckoutHost";

export function PayDepositButton({
  appointmentId,
  label = "Pay deposit now",
}: {
  appointmentId: string;
  label?: string;
}) {
  const { openCheckout } = useClinicCheckout();

  return (
    <button
      type="button"
      onClick={() => openCheckout(appointmentId, { autoOpen: true })}
      className="mt-4 inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-700"
    >
      {label}
      <ArrowRight className="h-4 w-4" />
    </button>
  );
}
