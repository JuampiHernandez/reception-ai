import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { getTenantBySlug } from "@/lib/tenant";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { clinicPath } from "@/lib/routes";

export async function GET(
  request: NextRequest,
  ctx: { params: Promise<{ tenant: string }> }
) {
  const { tenant: slug } = await ctx.params;
  const appointmentId = request.nextUrl.searchParams.get("appointment_id");

  if (!appointmentId) {
    return NextResponse.json({ error: "appointment_id required" }, { status: 400 });
  }

  const tenant = await getTenantBySlug(slug);
  if (!tenant) {
    return NextResponse.json({ error: "Clinic not found" }, { status: 404 });
  }

  const appointment = await db.query.appointments.findFirst({
    where: eq(schema.appointments.id, appointmentId),
  });

  if (!appointment || appointment.tenantId !== tenant.id) {
    return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
  }

  const [service, doctor, slot] = await Promise.all([
    db.query.services.findFirst({ where: eq(schema.services.id, appointment.serviceId) }),
    db.query.doctors.findFirst({ where: eq(schema.doctors.id, appointment.doctorId) }),
    db.query.appointmentSlots.findFirst({ where: eq(schema.appointmentSlots.id, appointment.slotId) }),
  ]);

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const amountCents = appointment.amountCents ?? service?.depositCents ?? 0;
  const currency = service?.currency ?? "usd";

  return NextResponse.json({
    appointment_id: appointmentId,
    checkout_url: appointment.paymentUrl,
    payment_page_url: `${baseUrl}${clinicPath(slug, "pay")}?appointment_id=${appointmentId}`,
    amount_display: formatCurrency(amountCents, currency),
    amount_cents: amountCents,
    service_name: service?.name ?? "Appointment",
    doctor_name: doctor?.name,
    slot_display: slot ? formatDateTime(slot.startsAt) : null,
    patient_name: appointment.patientName,
    status: appointment.status,
    clinic_name: tenant.name,
  });
}
