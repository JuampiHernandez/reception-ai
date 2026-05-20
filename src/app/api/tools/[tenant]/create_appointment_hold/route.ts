import { NextRequest } from "next/server";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";
import { authenticateToolRequest, toolJson, toolError } from "@/lib/tools-auth";
import {
  resolveOpenSlot,
  resolveService,
  listOpenSlots,
  formatSlotOption,
  normalizeLabel,
} from "@/lib/booking-resolve";
import { bodyFromRequest } from "@/lib/tool-request";
import { toolLog, withToolDebug } from "@/lib/tool-log";
import { formatDateTime, formatCurrency } from "@/lib/utils";

function pickBodyFields(body: Record<string, unknown>) {
  return {
    slot_id: body.slot_id ?? body.slotId,
    service_id: body.service_id ?? body.serviceId,
    doctor_id: body.doctor_id ?? body.doctorId,
    patient_name: body.patient_name ?? body.patientName,
    patient_phone: body.patient_phone ?? body.patientPhone,
    patient_email: body.patient_email ?? body.patientEmail,
    reason: body.reason ?? body.symptoms,
  };
}

async function handleCreateAppointmentHold(
  request: NextRequest,
  slug: string
) {
  const tenant = await authenticateToolRequest(request, slug);
  if (!tenant) return toolError("Unauthorized", 401);

  const body = await bodyFromRequest(request);
  const fields = pickBodyFields(body);
  const slotRef = String(fields.slot_id ?? "");
  let serviceRef = String(fields.service_id ?? "");
  const doctorId = fields.doctor_id ? String(fields.doctor_id) : null;
  const patientName = fields.patient_name ? String(fields.patient_name) : undefined;
  const patientPhone = fields.patient_phone ? String(fields.patient_phone) : undefined;
  const patientEmail = fields.patient_email ? String(fields.patient_email).trim().toLowerCase() : undefined;
  const reason = fields.reason ? String(fields.reason) : undefined;

  toolLog("create_appointment_hold.request", {
    tenant: slug,
    method: request.method,
    received: fields,
    normalized_slot: normalizeLabel(slotRef),
  });

  if (!slotRef) {
    return toolJson(
      withToolDebug(
        {
          error: "slot_id required. Call get_availability and pass slot_id or the display time.",
        },
        { received: fields }
      ),
      400
    );
  }

  if (!serviceRef) {
    serviceRef = "svc_urgent";
    toolLog("create_appointment_hold.default_service", { serviceRef });
  }

  const slot = await resolveOpenSlot(tenant.id, slotRef, doctorId);
  if (!slot) {
    const available = (await listOpenSlots(tenant.id, doctorId))
      .slice(0, 8)
      .map(formatSlotOption);

    toolLog("create_appointment_hold.slot_not_found", {
      tenant: slug,
      slotRef,
      doctorId,
      available_count: available.length,
    });

    return toolJson(
      withToolDebug(
        {
          error: `Could not hold slot "${slotRef}". Pick one of the available_slots below and retry create_appointment_hold with that slot_id.`,
          available_slots: available,
        },
        { received: fields, normalized_slot: normalizeLabel(slotRef) }
      ),
      409
    );
  }

  const service = await resolveService(tenant.id, serviceRef);
  if (!service) {
    toolLog("create_appointment_hold.service_not_found", {
      tenant: slug,
      serviceRef,
    });

    return toolJson(
      withToolDebug(
        {
          error: `Service not found for "${serviceRef}". Use service_id from recommend_doctor (e.g. svc_urgent).`,
        },
        { received: fields }
      ),
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
    patientEmail,
    reason,
    status: "held",
    amountCents: service.depositCents,
  });

  toolLog("create_appointment_hold.success", {
    tenant: slug,
    appointmentId,
    slot_id: slot.id,
    service_id: service.id,
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
      "Appointment held for 10 minutes. Immediately call send_payment_link with this appointment_id in the same turn — do not wait for the patient to respond first.",
  });
}

export async function GET(
  request: NextRequest,
  ctx: { params: Promise<{ tenant: string }> }
) {
  const { tenant: slug } = await ctx.params;
  return handleCreateAppointmentHold(request, slug);
}

export async function POST(
  request: NextRequest,
  ctx: { params: Promise<{ tenant: string }> }
) {
  const { tenant: slug } = await ctx.params;
  return handleCreateAppointmentHold(request, slug);
}
