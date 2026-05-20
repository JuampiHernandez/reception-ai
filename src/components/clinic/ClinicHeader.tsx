import Link from "next/link";
import { Phone, MapPin } from "lucide-react";
import { clinicPath } from "@/lib/routes";
import { Button } from "@/components/ui/button";

type Tenant = {
  name: string;
  phone: string | null;
  address: string | null;
};

function ToothLogo() {
  return (
    <svg viewBox="0 0 32 32" className="h-6 w-6" aria-hidden>
      <path
        d="M16 4c-3 0-5.5 2-6.5 5.5C8.5 8 7 9.5 7 12c0 2 1 3.5 2 5l1 9c.5 1.5 2 2.5 3.5 2 1-.5 1.5-1.5 2-2.5l1-9c1-1.5 2-3 2-5 0-2.5-1.5-4-2.5-4.5C21.5 6 19 4 16 4z"
        fill="currentColor"
      />
    </svg>
  );
}

export function ClinicHeader({ tenant, slug }: { tenant: Tenant; slug: string }) {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <Link href={clinicPath(slug)} className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-600 text-white shadow-sm">
            <ToothLogo />
          </div>
          <div>
            <p className="font-semibold text-slate-900">{tenant.name}</p>
            <p className="text-xs text-slate-500">AI receptionist · Book online 24/7</p>
          </div>
        </Link>
        <nav className="flex items-center gap-5 text-sm font-medium text-slate-600">
          <Link href={clinicPath(slug)} className="hover:text-teal-700">
            Home
          </Link>
          <Link href={clinicPath(slug, "appointments")} className="hover:text-teal-700">
            My appointments
          </Link>
          <Link href={clinicPath(slug, "login")}>
            <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
              Sign in
            </Button>
          </Link>
        </nav>
      </div>
      {(tenant.phone || tenant.address) && (
        <div className="border-t border-slate-100 bg-slate-50/80 px-6 py-2">
          <div className="mx-auto flex max-w-6xl flex-wrap gap-6 text-xs text-slate-600">
            {tenant.phone && (
              <span className="flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-teal-600" />
                {tenant.phone}
              </span>
            )}
            {tenant.address && (
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-teal-600" />
                {tenant.address}
              </span>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
