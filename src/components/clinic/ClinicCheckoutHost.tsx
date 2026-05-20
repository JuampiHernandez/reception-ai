"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { CheckoutModal } from "./CheckoutModal";

type CheckoutContextValue = {
  openCheckout: (appointmentId: string, options?: { autoOpen?: boolean }) => void;
};

const CheckoutContext = createContext<CheckoutContextValue | null>(null);

export function ClinicCheckoutHost({
  tenantSlug,
  children,
}: {
  tenantSlug: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [appointmentId, setAppointmentId] = useState("");
  const [autoOpen, setAutoOpen] = useState(false);

  const openCheckout = useCallback((id: string, options?: { autoOpen?: boolean }) => {
    setAppointmentId(id);
    setAutoOpen(options?.autoOpen ?? false);
    setOpen(true);
  }, []);

  return (
    <CheckoutContext.Provider value={{ openCheckout }}>
      {children}
      {appointmentId && (
        <CheckoutModal
          tenantSlug={tenantSlug}
          appointmentId={appointmentId}
          open={open}
          onClose={() => setOpen(false)}
          autoOpenCheckout={autoOpen}
        />
      )}
    </CheckoutContext.Provider>
  );
}

export function useClinicCheckout() {
  const ctx = useContext(CheckoutContext);
  if (!ctx) {
    throw new Error("useClinicCheckout must be used within ClinicCheckoutHost");
  }
  return ctx;
}
