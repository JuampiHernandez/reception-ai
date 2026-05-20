import { NextRequest } from "next/server";
import { db, schema } from "@/lib/db";
import { eq, and, gte } from "drizzle-orm";
import { authenticateToolRequest, toolJson, toolError } from "@/lib/tools-auth";
import { formatDateTime } from "@/lib/utils";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tenant: string }> }
) {
  const { tenant: slug } = await params;
  const tenant = await authenticateToolRequest(request, slug);
  if (!tenant) return toolError("Unauthorized", 401);

  const doctorId = request.nextUrl.searchParams.get("doctor_id");
  if (!doctorId) return toolError("doctor_id required");

  const now = new Date();
  const slots = await db.query.appointmentSlots.findMany({
    where: and(
      eq(schema.appointmentSlots.tenantId, tenant.id),
      eq(schema.appointmentSlots.doctorId, doctorId),
      eq(schema.appointmentSlots.status, "open"),
      gte(schema.appointmentSlots.startsAt, now)
    ),
  });

  const sorted = slots
    .sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime())
    .slice(0, 8);

  const doctor = await db.query.doctors.findFirst({
    where: eq(schema.doctors.id, doctorId),
  });

  return toolJson({
    doctor_id: doctorId,
    doctor_name: doctor?.name,
    slots: sorted.map((s) => ({
      slot_id: s.id,
      starts_at: s.startsAt.toISOString(),
      display: formatDateTime(s.startsAt),
      booking_hint: `Use slot_id "${s.id}" when calling create_appointment_hold`,
    })),
  });
}
