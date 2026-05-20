"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { clinicPath } from "@/lib/routes";
import { ClinicPageShell, ClinicCard } from "@/components/clinic/ClinicPageShell";

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
    <ClinicPageShell
      slug={slug}
      title={confirmed ? "Appointment confirmed!" : "Processing payment…"}
      description={
        confirmed
          ? "Your deposit was received. We'll see you at your scheduled time."
          : "Please wait while we confirm your payment."
      }
      backLabel="Back to home"
    >
      <ClinicCard className="text-center">
        <CheckCircle2 className="mx-auto h-16 w-16 text-teal-600" />
        {appointmentId && (
          <p className="mt-4 font-mono text-xs text-slate-400">{appointmentId}</p>
        )}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href={clinicPath(slug, "appointments")}>
            <Button className="bg-teal-600 hover:bg-teal-700">View my appointments</Button>
          </Link>
          <Link href={clinicPath(slug)}>
            <Button variant="outline">Back to home</Button>
          </Link>
        </div>
      </ClinicCard>
    </ClinicPageShell>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center text-slate-500">Loading…</div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
