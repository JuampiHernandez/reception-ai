import { redirect, notFound } from "next/navigation";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { getTenantBySlug } from "@/lib/tenant";
import { clinicPath } from "@/lib/routes";

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

  redirect(appointment.paymentUrl);
}
