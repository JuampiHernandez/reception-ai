import { NextRequest } from "next/server";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { authenticateToolRequest, toolJson, toolError } from "@/lib/tools-auth";
import { formatDateTime } from "@/lib/utils";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tenant: string }> }
) {
  const { tenant: slug } = await params;
  const tenant = await authenticateToolRequest(request, slug);
  if (!tenant) return toolError("Unauthorized", 401);

  const appointmentId = request.nextUrl.searchParams.get("appointment_id");
  if (!appointmentId) return toolError("appointment_id required");

  const appointment = await db.query.appointments.findFirst({
    where: eq(schema.appointments.id, appointmentId),
  });
  if (!appointment || appointment.tenantId !== tenant.id) {
    return toolError("Appointment not found", 404);
  }

  const slot = await db.query.appointmentSlots.findFirst({
    where: eq(schema.appointmentSlots.id, appointment.slotId),
  });
  const doctor = await db.query.doctors.findFirst({
    where: eq(schema.doctors.id, appointment.doctorId),
  });
  const service = await db.query.services.findFirst({
    where: eq(schema.services.id, appointment.serviceId),
  });

  return toolJson({
    appointment_id: appointmentId,
    status: appointment.status,
    confirmed: appointment.status === "confirmed",
    doctor_name: doctor?.name,
    service_name: service?.name,
    slot_display: slot ? formatDateTime(slot.startsAt) : null,
    address: tenant.address,
    payment_url: appointment.paymentUrl,
  });
}
