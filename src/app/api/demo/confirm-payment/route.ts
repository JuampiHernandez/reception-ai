import { NextRequest } from "next/server";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

export async function POST(request: NextRequest) {
  const { appointment_id } = await request.json();
  if (!appointment_id) {
    return Response.json({ error: "appointment_id required" }, { status: 400 });
  }

  const appointment = await db.query.appointments.findFirst({
    where: eq(schema.appointments.id, appointment_id),
  });
  if (!appointment) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  await db
    .update(schema.appointments)
    .set({ status: "confirmed", confirmedAt: new Date() })
    .where(eq(schema.appointments.id, appointment_id));

  await db
    .update(schema.appointmentSlots)
    .set({ status: "booked" })
    .where(eq(schema.appointmentSlots.id, appointment.slotId));

  await db.insert(schema.paymentEvents).values({
    id: randomUUID(),
    tenantId: appointment.tenantId,
    appointmentId: appointment_id,
    type: "deposit_collected",
    amountCents: appointment.amountCents ?? 5000,
    description: "Mock payment confirmed (demo mode)",
  });

  return Response.json({ success: true, status: "confirmed" });
}
