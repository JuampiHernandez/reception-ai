import { NextRequest } from "next/server";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";
import { authenticateToolRequest, toolJson, toolError } from "@/lib/tools-auth";
import { resolveOpenSlot, resolveService } from "@/lib/booking-resolve";
import { formatDateTime, formatCurrency } from "@/lib/utils";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ tenant: string }> }
) {
  const { tenant: slug } = await params;
  const tenant = await authenticateToolRequest(request, slug);
  if (!tenant) return toolError("Unauthorized", 401);

  const body = await request.json();
  const slotRef = body.slot_id ?? body.slotId;
  const serviceRef = body.service_id ?? body.serviceId;
  const doctorId = body.doctor_id ?? body.doctorId ?? null;
  const patientName = body.patient_name ?? body.patientName;
  const patientPhone = body.patient_phone ?? body.patientPhone;
  const reason = body.reason ?? body.symptoms;

  if (!slotRef || !serviceRef) {
    return toolError(
      "slot_id and service_id required. Use exact slot_id from get_availability (e.g. slot_doc_ana_1779717600000), not the display time."
    );
  }

  const slot = await resolveOpenSlot(tenant.id, slotRef, doctorId);
  if (!slot) {
    return toolError(
      `Slot not available for "${slotRef}". Call get_availability again and pass the exact slot_id field.`,
      409
    );
  }

  const service = await resolveService(tenant.id, serviceRef);
  if (!service) {
    return toolError(
      `Service not found for "${serviceRef}". Use service_id from recommend_doctor (e.g. svc_urgent).`,
      404
    );
  }

  const doctor = await db.query.doctors.findFirst({
    where: eq(schema.doctors.id, slot.doctorId),
  });

  const holdExpires = new Date(Date.now() + 10 * 60 * 1000);
  const appointmentId = randomUUID();

  await db
    .update(schema.appointmentSlots)
    .set({ status: "held", holdExpiresAt: holdExpires })
    .where(eq(schema.appointmentSlots.id, slot.id));

  await db.insert(schema.appointments).values({
    id: appointmentId,
    tenantId: tenant.id,
    doctorId: slot.doctorId,
    slotId: slot.id,
    serviceId: service.id,
    patientName,
    patientPhone,
    reason,
    status: "held",
    amountCents: service.depositCents,
  });

  return toolJson({
    appointment_id: appointmentId,
    status: "held",
    doctor_name: doctor?.name,
    specialty: doctor?.specialty,
    slot_id: slot.id,
    slot_display: formatDateTime(slot.startsAt),
    starts_at: slot.startsAt.toISOString(),
    service_id: service.id,
    service_name: service.name,
    deposit_cents: service.depositCents,
    deposit_display: formatCurrency(service.depositCents, service.currency),
    hold_expires_at: holdExpires.toISOString(),
    message:
      "Appointment held for 10 minutes. Call send_payment_link with appointment_id to send the Stripe deposit link.",
  });
}
