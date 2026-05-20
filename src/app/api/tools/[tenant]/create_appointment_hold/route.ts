import { NextRequest } from "next/server";
import { db, schema } from "@/lib/db";
import { eq, and } from "drizzle-orm";
import { randomUUID } from "crypto";
import { authenticateToolRequest, toolJson, toolError } from "@/lib/tools-auth";
import { formatDateTime, formatCurrency } from "@/lib/utils";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ tenant: string }> }
) {
  const { tenant: slug } = await params;
  const tenant = await authenticateToolRequest(request, slug);
  if (!tenant) return toolError("Unauthorized", 401);

  const body = await request.json();
  const { slot_id, service_id, patient_name, patient_phone, reason } = body;
  if (!slot_id || !service_id) {
    return toolError("slot_id and service_id required");
  }

  const slot = await db.query.appointmentSlots.findFirst({
    where: and(
      eq(schema.appointmentSlots.id, slot_id),
      eq(schema.appointmentSlots.tenantId, tenant.id)
    ),
  });
  if (!slot || slot.status !== "open") {
    return toolError("Slot not available", 409);
  }

  const service = await db.query.services.findFirst({
    where: eq(schema.services.id, service_id),
  });
  if (!service) return toolError("Service not found", 404);

  const doctor = await db.query.doctors.findFirst({
    where: eq(schema.doctors.id, slot.doctorId),
  });

  const holdExpires = new Date(Date.now() + 10 * 60 * 1000);
  const appointmentId = randomUUID();

  await db
    .update(schema.appointmentSlots)
    .set({ status: "held", holdExpiresAt: holdExpires })
    .where(eq(schema.appointmentSlots.id, slot_id));

  await db.insert(schema.appointments).values({
    id: appointmentId,
    tenantId: tenant.id,
    doctorId: slot.doctorId,
    slotId: slot_id,
    serviceId: service_id,
    patientName: patient_name ?? body.patientName,
    patientPhone: patient_phone ?? body.patientPhone,
    reason: reason ?? body.symptoms,
    status: "held",
    amountCents: service.depositCents,
  });

  return toolJson({
    appointment_id: appointmentId,
    status: "held",
    doctor_name: doctor?.name,
    specialty: doctor?.specialty,
    slot_display: formatDateTime(slot.startsAt),
    starts_at: slot.startsAt.toISOString(),
    service_name: service.name,
    deposit_cents: service.depositCents,
    deposit_display: formatCurrency(service.depositCents, service.currency),
    hold_expires_at: holdExpires.toISOString(),
    message:
      "Turno reservado temporalmente por 10 minutos. Enviá el link de pago para confirmar.",
  });
}
