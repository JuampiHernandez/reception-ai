import { NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { authenticateToolRequest, toolJson, toolError } from "@/lib/tools-auth";
import { db, schema } from "@/lib/db";
import { releaseExpiredHolds } from "@/lib/booking-resolve";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tenant: string }> }
) {
  const { tenant: slug } = await params;
  const tenant = await authenticateToolRequest(request, slug);
  if (!tenant) return toolError("Unauthorized", 401);

  const released = await releaseExpiredHolds(tenant.id);
  const doctors = await db.query.doctors.findMany({
    where: eq(schema.doctors.tenantId, tenant.id),
  });
  const openSlots = await db.query.appointmentSlots.findMany({
    where: eq(schema.appointmentSlots.tenantId, tenant.id),
  });

  return toolJson({
    ok: true,
    tenant: tenant.slug,
    doctors: doctors.length,
    open_slots: openSlots.filter((s) => s.status === "open").length,
    held_slots: openSlots.filter((s) => s.status === "held").length,
    released_expired_holds: released,
    tool_debug: process.env.TOOL_DEBUG === "1",
  });
}
