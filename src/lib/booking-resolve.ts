import { db, schema } from "@/lib/db";
import { eq, and, gte, lt } from "drizzle-orm";
import { formatDateTime } from "@/lib/utils";

export function normalizeLabel(value: string) {
  return value
    .toLowerCase()
    .replace(/\bmonday\b/g, "mon")
    .replace(/\btuesday\b/g, "tue")
    .replace(/\bwednesday\b/g, "wed")
    .replace(/\bthursday\b/g, "thu")
    .replace(/\bfriday\b/g, "fri")
    .replace(/\bsaturday\b/g, "sat")
    .replace(/\bsunday\b/g, "sun")
    .replace(/\b(\d{1,2})(st|nd|rd|th)\b/g, "$1")
    .replace(/\bat\b/g, " ")
    .replace(/[^a-z0-9]/g, "");
}

export function labelsMatch(a: string, b: string) {
  const na = normalizeLabel(a);
  const nb = normalizeLabel(b);
  if (!na || !nb) return false;
  return na === nb || na.includes(nb) || nb.includes(na);
}

export async function releaseExpiredHolds(tenantId: string) {
  const now = new Date();
  const expired = await db.query.appointmentSlots.findMany({
    where: and(
      eq(schema.appointmentSlots.tenantId, tenantId),
      eq(schema.appointmentSlots.status, "held"),
      lt(schema.appointmentSlots.holdExpiresAt, now)
    ),
  });

  for (const slot of expired) {
    await db
      .update(schema.appointmentSlots)
      .set({ status: "open", holdExpiresAt: null })
      .where(eq(schema.appointmentSlots.id, slot.id));
  }

  return expired.length;
}

export async function listOpenSlots(tenantId: string, doctorId?: string | null) {
  const now = new Date();
  return db.query.appointmentSlots.findMany({
    where: and(
      eq(schema.appointmentSlots.tenantId, tenantId),
      eq(schema.appointmentSlots.status, "open"),
      gte(schema.appointmentSlots.startsAt, now),
      ...(doctorId ? [eq(schema.appointmentSlots.doctorId, doctorId)] : [])
    ),
  });
}

export async function resolveOpenSlot(
  tenantId: string,
  slotRef: string,
  doctorId?: string | null
) {
  await releaseExpiredHolds(tenantId);

  const exact = await db.query.appointmentSlots.findFirst({
    where: and(
      eq(schema.appointmentSlots.id, slotRef),
      eq(schema.appointmentSlots.tenantId, tenantId)
    ),
  });
  if (exact?.status === "open") return exact;

  const openSlots = await listOpenSlots(tenantId, doctorId);

  return (
    openSlots.find((slot) => {
      const display = formatDateTime(slot.startsAt);
      return (
        labelsMatch(slot.id, slotRef) ||
        labelsMatch(display, slotRef) ||
        labelsMatch(slot.startsAt.toISOString(), slotRef)
      );
    }) ?? null
  );
}

export async function resolveService(tenantId: string, serviceRef: string) {
  const byId = await db.query.services.findFirst({
    where: eq(schema.services.id, serviceRef),
  });
  if (byId && byId.tenantId === tenantId) return byId;

  const services = await db.query.services.findMany({
    where: eq(schema.services.tenantId, tenantId),
  });

  const normalized = normalizeLabel(serviceRef);
  return (
    services.find(
      (service) =>
        labelsMatch(service.name, serviceRef) ||
        normalizeLabel(service.name) === normalized
    ) ?? null
  );
}

export function formatSlotOption(slot: { id: string; startsAt: Date }) {
  return {
    slot_id: slot.id,
    display: formatDateTime(slot.startsAt),
    starts_at: slot.startsAt.toISOString(),
  };
}
