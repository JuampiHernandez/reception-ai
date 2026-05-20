"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, LogOut } from "lucide-react";
import { createClient, isPatientAuthConfigured } from "@/lib/supabase/client";
import { clinicPath } from "@/lib/routes";
export function PatientAuthBanner({
  slug,
  email,
}: {
  slug: string;
  email: string | null;
}) {
  const [signingOut, setSigningOut] = useState(false);
  const configured = isPatientAuthConfigured();

  if (!configured) return null;

  async function signOut() {
    const supabase = createClient();
    if (!supabase) return;
    setSigningOut(true);
    await supabase.auth.signOut();
    window.location.href = clinicPath(slug);
  }

  if (email) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-teal-100 bg-teal-50/80 px-4 py-2 text-sm">
        <span className="flex items-center gap-2 text-slate-700">
          <Mail className="h-4 w-4 text-teal-600" />
          Signed in as <strong>{email}</strong>
        </span>
        <button
          type="button"
          onClick={signOut}
          disabled={signingOut}
          className="flex items-center gap-1 text-teal-800 hover:underline"
        >
          <LogOut className="h-3.5 w-3.5" />
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
      <Link href={clinicPath(slug, "login")} className="font-medium text-teal-700 hover:underline">
        Sign in with email
      </Link>{" "}
      to see appointments and pay pending deposits after your call.
    </div>
  );
}
