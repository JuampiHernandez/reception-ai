"use client";

import { useCallback, useEffect, useState } from "react";
import { X, Shield, ArrowRight, Loader2, Lock } from "lucide-react";
type PaymentDetails = {
  appointment_id: string;
  checkout_url: string | null;
  amount_display: string;
  service_name: string;
  doctor_name?: string | null;
  slot_display?: string | null;
  patient_name?: string | null;
  clinic_name: string;
  status: string;
};

export function CheckoutModal({
  tenantSlug,
  appointmentId,
  open,
  onClose,
  autoOpenCheckout,
}: {
  tenantSlug: string;
  appointmentId: string;
  open: boolean;
  onClose: () => void;
  autoOpenCheckout?: boolean;
}) {
  const [details, setDetails] = useState<PaymentDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);

  const loadDetails = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/clinic/${tenantSlug}/payment-details?appointment_id=${encodeURIComponent(appointmentId)}`
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not load payment details");
        setDetails(null);
        return;
      }
      setDetails(data as PaymentDetails);
    } catch {
      setError("Network error. Try again.");
      setDetails(null);
    } finally {
      setLoading(false);
    }
  }, [tenantSlug, appointmentId]);

  useEffect(() => {
    if (open && appointmentId) void loadDetails();
  }, [open, appointmentId, loadDetails]);

  function openCheckoutPopup(url: string) {
    const w = 520;
    const h = 720;
    const left = window.screenX + (window.outerWidth - w) / 2;
    const top = window.screenY + (window.outerHeight - h) / 2;
    const popup = window.open(
      url,
      "smilecare_checkout",
      `popup=yes,width=${w},height=${h},left=${left},top=${top},noopener,noreferrer`
    );
    if (!popup) {
      window.location.href = url;
    }
  }

  function handlePay() {
    if (!details?.checkout_url) return;
    setPaying(true);
    openCheckoutPopup(details.checkout_url);
    setTimeout(() => setPaying(false), 800);
  }

  useEffect(() => {
    if (!autoOpenCheckout || !details?.checkout_url || loading) return;
    openCheckoutPopup(details.checkout_url);
  }, [autoOpenCheckout, details?.checkout_url, loading]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close checkout"
      />
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-100 text-teal-700">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <p id="checkout-title" className="text-sm font-semibold text-slate-900">
                Secure deposit
              </p>
              <p className="text-xs text-slate-500">{details?.clinic_name ?? "SmileCare"}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-5 py-6">
          {loading && (
            <div className="flex flex-col items-center py-8 text-slate-500">
              <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
              <p className="mt-3 text-sm">Loading payment details…</p>
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-800">
              {error}
            </div>
          )}

          {details && !loading && (
            <>
              <p className="text-sm text-slate-600">
                Complete your deposit to confirm your appointment. Payment opens in a secure
                Stripe window.
              </p>
              <dl className="mt-5 space-y-3 rounded-xl border border-slate-100 bg-slate-50/80 p-4 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">Service</dt>
                  <dd className="font-medium text-slate-900">{details.service_name}</dd>
                </div>
                {details.doctor_name && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-500">Doctor</dt>
                    <dd className="font-medium text-slate-900">{details.doctor_name}</dd>
                  </div>
                )}
                {details.slot_display && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-500">When</dt>
                    <dd className="font-medium text-slate-900">{details.slot_display}</dd>
                  </div>
                )}
                {details.patient_name && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-500">Patient</dt>
                    <dd className="font-medium text-slate-900">{details.patient_name}</dd>
                  </div>
                )}
                <div className="flex justify-between gap-4 border-t border-slate-200 pt-3">
                  <dt className="font-semibold text-slate-700">Deposit due</dt>
                  <dd className="text-lg font-bold text-teal-700">{details.amount_display}</dd>
                </div>
              </dl>

              <button
                type="button"
                onClick={handlePay}
                disabled={!details.checkout_url || paying}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:opacity-50"
              >
                {paying ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Pay securely
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-slate-500">
                <Lock className="h-3.5 w-3.5" />
                Powered by Stripe · Card data never touches our servers
              </p>
            </>
          )}
        </div>

        {!loading && (
          <div className="border-t border-slate-100 bg-slate-50/50 px-5 py-3 text-center">
            <button
              type="button"
              onClick={onClose}
              className="text-sm text-slate-600 hover:text-teal-700"
            >
              Continue on site
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/** Parse appointment_id from /pay?appointment_id= URLs */
export function appointmentIdFromPayUrl(url: string): string | null {
  try {
    const parsed = new URL(url, "http://local");
    return parsed.searchParams.get("appointment_id");
  } catch {
    const match = url.match(/appointment_id=([^&]+)/);
    return match?.[1] ?? null;
  }
}
