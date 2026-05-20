import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTenantBySlug } from "@/lib/tenant";
import { ClinicHeader } from "@/components/clinic/ClinicHeader";
import { ClinicFooter } from "@/components/clinic/ClinicFooter";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tenant: string }>;
}): Promise<Metadata> {
  const { tenant: slug } = await params;
  const tenant = await getTenantBySlug(slug);
  if (!tenant) return { title: "Not found" };
  return {
    title: `${tenant.name} — Book an appointment`,
    description: tenant.greeting ?? `Book appointments with ${tenant.name} using our AI receptionist.`,
  };
}

export default async function ClinicLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: slug } = await params;
  const tenant = await getTenantBySlug(slug);
  if (!tenant) notFound();

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <ClinicHeader tenant={tenant} slug={slug} />
      <main className="flex-1">{children}</main>
      <ClinicFooter />
    </div>
  );
}
