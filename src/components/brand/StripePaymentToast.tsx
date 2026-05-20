export function StripePaymentToast({ amount = "$200 deposit paid" }: { amount?: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-lg">
      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#635BFF] text-xs font-bold text-white">
        S
      </div>
      <div>
        <p className="text-sm font-medium text-deep-navy">Stripe payment</p>
        <p className="text-xs text-slate-gray">
          {amount} — Payment successful
        </p>
      </div>
    </div>
  );
}
