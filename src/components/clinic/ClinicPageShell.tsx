import Link from "next/link";
import { clinicPath } from "@/lib/routes";

export function ClinicPageShell({
  slug,
  title,
  description,
  children,
  backLabel = "Back to home",
}: {
  slug: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  backLabel?: string;
}) {
  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <Link
        href={clinicPath(slug)}
        className="text-sm font-medium text-teal-700 hover:text-teal-800"
      >
        ← {backLabel}
      </Link>
      <h1 className="mt-6 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
        {title}
      </h1>
      {description && <p className="mt-2 text-slate-600">{description}</p>}
      <div className="mt-8">{children}</div>
    </div>
  );
}

export function ClinicCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}
