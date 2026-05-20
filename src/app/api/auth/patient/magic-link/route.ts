import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getTenantBySlug } from "@/lib/tenant";
import { clinicPath } from "@/lib/routes";

export async function POST(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!url || !key || !appUrl) {
    return NextResponse.json(
      { error: "Patient sign-in is not configured. Add Supabase URL and anon key to .env.local." },
      { status: 503 }
    );
  }

  const body = await request.json();
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const tenantSlug = typeof body.tenant === "string" ? body.tenant : "";

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  const tenant = await getTenantBySlug(tenantSlug);
  if (!tenant) {
    return NextResponse.json({ error: "Clinic not found" }, { status: 404 });
  }

  const supabase = createClient(url, key);
  const redirectTo = `${appUrl}/auth/callback?next=${encodeURIComponent(clinicPath(tenantSlug, "appointments"))}`;

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: redirectTo,
      data: { tenant_slug: tenantSlug, role: "patient" },
    },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
