import { notFound, redirect } from "next/navigation";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { getTenantBySlug } from "@/lib/tenant";
import { clinicPath } from "@/lib/routes";
import { formatCurrency } from "@/lib/utils";
import { ClinicPageShell } from "@/components/clinic/ClinicPageShell";
import { PayCheckout } from "./PayCheckout";

export default async function ClinicPayPage({
  params,
  searchParams,
}: {
  params: Promise<{ tenant: string }>;
  searchParams: Promise<{ appointment_id?: string }>;
}) {
  const { tenant: slug } = await params;
  const { appointment_id: appointmentId } = await searchParams;

  const tenant = await getTenantBySlug(slug);
  if (!tenant) notFound();

  if (!appointmentId) {
    redirect(clinicPath(slug));
  }

  const appointment = await db.query.appointments.findFirst({
    where: eq(schema.appointments.id, appointmentId),
  });

  if (!appointment || appointment.tenantId !== tenant.id) {
    redirect(`${clinicPath(slug)}?payment=missing`);
  }

  if (!appointment.paymentUrl) {
    redirect(`${clinicPath(slug)}?payment=missing`);
  }

  const service = await db.query.services.findFirst({
    where: eq(schema.services.id, appointment.serviceId),
  });

  const amountCents = appointment.amountCents ?? service?.depositCents ?? 0;
  const currency = service?.currency ?? "usd";

  return (
    <ClinicPageShell
      slug={slug}
      title="Pay your deposit"
      description="A secure checkout window will open to confirm your appointment."
      backLabel="Back to receptionist"
    >
      <PayCheckout
        appointmentId={appointmentId}
        amountDisplay={formatCurrency(amountCents, currency)}
        serviceName={service?.name ?? "Appointment"}
      />
    </ClinicPageShell>
  );
}
