import { db, schema } from "@/lib/db";
import { eq, desc } from "drizzle-orm";
import { normalizePhone, phonesMatch } from "@/lib/phone";

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
    (a) => a.patientPhone && phonesMatch(normalized, a.patientPhone)
  );

  return enrichAppointments(matched);
}
