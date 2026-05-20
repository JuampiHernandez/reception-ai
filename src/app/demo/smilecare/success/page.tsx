"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const appointmentId = searchParams.get("appointment_id");
  const mockPayment = searchParams.get("mock_payment");
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (!appointmentId) return;
    if (mockPayment === "1") {
      fetch("/api/demo/confirm-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointment_id: appointmentId }),
      }).then(() => setConfirmed(true));
    } else {
      setConfirmed(true);
    }
  }, [appointmentId, mockPayment]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-deep-navy px-6 text-center text-white">
      <CheckCircle2 className="h-16 w-16 text-soft-mint" />
      <h1 className="mt-6 text-3xl font-bold">
        {confirmed ? "Appointment confirmed!" : "Processing payment..."}
      </h1>
      <p className="mt-4 max-w-md text-slate-300">
        Your deposit was received via Stripe. SmileCare Dental will see this in
        their dashboard.
      </p>
      {appointmentId && (
        <p className="mt-2 font-mono text-xs text-slate-500">{appointmentId}</p>
      )}
      <div className="mt-8 flex gap-4">
        <Link href="/dashboard/bookings">
          <Button>View bookings</Button>
        </Link>
        <Link href="/demo/smilecare">
          <Button variant="outline">Back to demo</Button>
        </Link>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-deep-navy" />}>
      <SuccessContent />
    </Suspense>
  );
}
