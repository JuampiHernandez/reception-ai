"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { clinicPath } from "@/lib/routes";
import { isPatientAuthConfigured } from "@/lib/supabase/client";

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
    <div className="mx-auto max-w-md px-6 py-12">
      <h1 className="text-2xl font-bold text-slate-900">Sign in with email</h1>
      <p className="mt-2 text-sm text-slate-600">
        We&apos;ll send a magic link from Supabase so you can view appointments and pay any pending
        deposits. Built-in email has rate limits (a few links per hour per address).
      </p>

      {!configured && (
        <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          Add <code className="rounded bg-amber-100 px-1">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to{" "}
          <code className="rounded bg-amber-100 px-1">.env.local</code> and enable Email auth in
          your Supabase project.
        </div>
      )}

      {sent ? (
        <div className="mt-8 rounded-xl border border-teal-200 bg-teal-50 p-6 text-sm text-teal-900">
          <p className="font-semibold">Check your inbox</p>
          <p className="mt-2">
            We sent a sign-in link to <strong>{email}</strong>. Click it to open your appointments.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <label className="block text-sm font-medium text-slate-700">
            Email
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={!configured}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-4 text-sm"
              />
            </div>
          </label>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading || !configured}>
            {loading ? "Sending…" : "Send magic link"}
          </Button>
        </form>
      )}

      <Link
        href={clinicPath(slug)}
        className="mt-6 block text-center text-sm text-slate-500 hover:text-teal-700"
      >
        ← Back to home
      </Link>
    </div>
  );
}
