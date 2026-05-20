import Link from "next/link";
import { Phone, MapPin } from "lucide-react";
import { clinicPath } from "@/lib/routes";

type Tenant = {
  name: string;
  phone: string | null;
  address: string | null;
};

export function ClinicHeader({ tenant, slug }: { tenant: Tenant; slug: string }) {
  return (
    <header className="border-b border-teal-100 bg-white shadow-sm">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <Link href={clinicPath(slug)} className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-600 text-lg font-bold text-white">
            {tenant.name.charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-slate-900">{tenant.name}</p>
            <p className="text-xs text-teal-700">AI reception · Book online 24/7</p>
          </div>
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-slate-600">
          <Link href={clinicPath(slug)} className="hover:text-teal-700">
            Home
          </Link>
          <Link href={clinicPath(slug, "appointments")} className="hover:text-teal-700">
            My appointments
          </Link>
          <Link href={clinicPath(slug, "login")} className="hover:text-teal-700">
            Sign in
          </Link>
        </nav>
      </div>
      {(tenant.phone || tenant.address) && (
        <div className="border-t border-teal-50 bg-teal-50/50 px-6 py-2">
          <div className="mx-auto flex max-w-5xl flex-wrap gap-6 text-xs text-slate-600">
            {tenant.phone && (
              <span className="flex items-center gap-1">
                <Phone className="h-3 w-3 text-teal-600" />
                {tenant.phone}
              </span>
            )}
            {tenant.address && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3 text-teal-600" />
                {tenant.address}
              </span>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
