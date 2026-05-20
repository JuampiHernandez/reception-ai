"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { clinicPath } from "@/lib/routes";

function SuccessContent() {
  const params = useParams<{ tenant: string }>();
  const slug = params.tenant;
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
    <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
      <CheckCircle2 className="h-16 w-16 text-teal-600" />
      <h1 className="mt-6 text-3xl font-bold text-slate-900">
        {confirmed ? "Appointment confirmed!" : "Processing payment..."}
      </h1>
      <p className="mt-4 max-w-md text-slate-600">
        Your deposit was received. We&apos;ll see you at your scheduled time.
      </p>
      {appointmentId && (
        <p className="mt-2 font-mono text-xs text-slate-400">{appointmentId}</p>
      )}
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link href={clinicPath(slug, "appointments")}>
          <Button>View my appointments</Button>
        </Link>
        <Link href={clinicPath(slug)}>
          <Button variant="outline">Back to home</Button>
        </Link>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-slate-500">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
