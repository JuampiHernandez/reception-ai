"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { clinicPath } from "@/lib/routes";
import { isPatientAuthConfigured } from "@/lib/supabase/client";
import { ClinicPageShell, ClinicCard } from "@/components/clinic/ClinicPageShell";

export default function PatientLoginPage() {
  const params = useParams();
  const slug = typeof params.tenant === "string" ? params.tenant : "";
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const configured = isPatientAuthConfigured();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/patient/magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, tenant: slug }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not send link");
        return;
      }
      setSent(true);
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ClinicPageShell
      slug={slug}
      title="Sign in with email"
      description="We'll send a magic link so you can view appointments and pay any pending deposits."
    >
      {!configured && (
        <ClinicCard className="mb-4 border-amber-200 bg-amber-50 text-sm text-amber-900">
          Add <code className="rounded bg-amber-100 px-1">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to{" "}
          <code className="rounded bg-amber-100 px-1">.env.local</code> and enable Email auth in
          your Supabase project.
        </ClinicCard>
      )}

      {sent ? (
        <ClinicCard className="border-teal-200 bg-teal-50/80 text-sm text-teal-900">
          <p className="font-semibold">Check your inbox</p>
          <p className="mt-2">
            We sent a sign-in link to <strong>{email}</strong>. Click it to open your appointments.
          </p>
        </ClinicCard>
      ) : (
        <ClinicCard>
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block text-sm font-medium text-slate-700">
              Email
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={!configured}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-100"
                />
              </div>
            </label>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-700"
              disabled={loading || !configured}
            >
              {loading ? "Sending…" : "Send magic link"}
            </Button>
          </form>
        </ClinicCard>
      )}

      <p className="mt-6 text-center text-sm text-slate-500">
        <Link href={clinicPath(slug, "appointments")} className="text-teal-700 hover:underline">
          View appointments by phone
        </Link>
      </p>
    </ClinicPageShell>
  );
}
