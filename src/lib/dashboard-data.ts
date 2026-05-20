import { db, schema } from "@/lib/db";
import { eq, desc, and, gte } from "drizzle-orm";

export async function getDashboardStats(tenantId: string) {
  const calls = await db.query.calls.findMany({
    where: eq(schema.calls.tenantId, tenantId),
  });
  const appointments = await db.query.appointments.findMany({
    where: eq(schema.appointments.tenantId, tenantId),
  });
  const payments = await db.query.paymentEvents.findMany({
    where: eq(schema.paymentEvents.tenantId, tenantId),
  });

  const callsAnswered = calls.length;
  const appointmentsBooked = appointments.filter(
    (a) => a.status === "confirmed"
  ).length;
  const depositsCollected = payments
    .filter((p) => p.type === "deposit_collected")
    .reduce((sum, p) => sum + (p.amountCents ?? 0), 0);
  const revenueSaved = appointmentsBooked * 12000;

  return {
    callsAnswered,
    appointmentsBooked,
    depositsCollected,
    revenueSaved,
  };
}

export async function getTenantCalls(tenantId: string, limit = 20) {
  return db.query.calls.findMany({
    where: eq(schema.calls.tenantId, tenantId),
    orderBy: [desc(schema.calls.createdAt)],
    limit,
  });
}

export async function getTenantAppointments(tenantId: string) {
  const appointments = await db.query.appointments.findMany({
    where: eq(schema.appointments.tenantId, tenantId),
    orderBy: [desc(schema.appointments.createdAt)],
  });

  const enriched = await Promise.all(
    appointments.map(async (a) => {
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
  return enriched;
}

export async function getTenantPayments(tenantId: string) {
  return db.query.paymentEvents.findMany({
    where: eq(schema.paymentEvents.tenantId, tenantId),
    orderBy: [desc(schema.paymentEvents.createdAt)],
  });
}

export async function getTenantFaqs(tenantId: string) {
  return db.query.faqs.findMany({
    where: eq(schema.faqs.tenantId, tenantId),
  });
}

export async function getTenantBusinessHours(tenantId: string) {
  return db.query.businessHours.findMany({
    where: eq(schema.businessHours.tenantId, tenantId),
  });
}
