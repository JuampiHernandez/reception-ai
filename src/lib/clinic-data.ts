import { db, schema } from "@/lib/db";
import { eq, desc } from "drizzle-orm";

function normalizePhone(phone: string) {
  return phone.replace(/\D/g, "");
}

export async function getPatientAppointmentsByEmail(tenantId: string, email: string) {
  const normalized = email.trim().toLowerCase();
  if (!normalized.includes("@")) return [];

  const appointments = await db.query.appointments.findMany({
    where: eq(schema.appointments.tenantId, tenantId),
    orderBy: [desc(schema.appointments.createdAt)],
    limit: 50,
  });

  const matched = appointments.filter(
    (a) => a.patientEmail && a.patientEmail.toLowerCase() === normalized
  );

  return enrichAppointments(matched);
}

async function enrichAppointments(
  matched: (typeof schema.appointments.$inferSelect)[]
) {
  return Promise.all(
    matched.map(async (a) => {
      const slot = await db.query.appointmentSlots.findFirst({
        where: eq(schema.appointmentSlots.id, a.slotId),
      });
      const doctor = await db.query.doctors.findFirst({
        where: eq(schema.doctors.id, a.doctorId),
      });
      const service = await db.query.services.findFirst({
        where: eq(schema.services.id, a.serviceId),
      });
      return { ...a, slot, doctor, service };
    })
  );
}

export async function getPatientAppointments(tenantId: string, phone: string) {
  const normalized = normalizePhone(phone);
  if (normalized.length < 6) return [];

  const appointments = await db.query.appointments.findMany({
    where: eq(schema.appointments.tenantId, tenantId),
    orderBy: [desc(schema.appointments.createdAt)],
    limit: 50,
  });

  const matched = appointments.filter(
    (a) => a.patientPhone && normalizePhone(a.patientPhone) === normalized
  );

  return enrichAppointments(matched);
}
