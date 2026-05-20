"use client";

import { useEffect } from "react";
import { useClinicCheckout } from "@/components/clinic/ClinicCheckoutHost";
import { ClinicCard } from "@/components/clinic/ClinicPageShell";
import { Shield, Loader2 } from "lucide-react";

export function PayCheckout({
  appointmentId,
  amountDisplay,
  serviceName,
}: {
  appointmentId: string;
  amountDisplay: string;
  serviceName: string;
}) {
  const { openCheckout } = useClinicCheckout();

  useEffect(() => {
    openCheckout(appointmentId, { autoOpen: true });
  }, [appointmentId, openCheckout]);

  return (
    <ClinicCard className="text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-teal-100 text-teal-700">
        <Shield className="h-7 w-7" />
      </div>
      <h2 className="mt-4 text-lg font-semibold text-slate-900">Complete your deposit</h2>
      <p className="mt-2 text-sm text-slate-600">
        {serviceName} · {amountDisplay}
      </p>
      <p className="mt-4 flex items-center justify-center gap-2 text-sm text-slate-500">
        <Loader2 className="h-4 w-4 animate-spin text-teal-600" />
        Opening secure checkout…
      </p>
      <button
        type="button"
        onClick={() => openCheckout(appointmentId, { autoOpen: true })}
        className="mt-6 text-sm font-medium text-teal-700 hover:text-teal-800"
      >
        Open checkout again
      </button>
    </ClinicCard>
  );
}
