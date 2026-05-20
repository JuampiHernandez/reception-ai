import { NextRequest } from "next/server";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { authenticateToolRequest, toolJson, toolError } from "@/lib/tools-auth";
import { formatCurrency } from "@/lib/utils";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tenant: string }> }
) {
  const { tenant: slug } = await params;
  const tenant = await authenticateToolRequest(request, slug);
  if (!tenant) return toolError("Unauthorized", 401);

  const serviceId =
    request.nextUrl.searchParams.get("service_id") ??
    request.nextUrl.searchParams.get("serviceId");
  if (!serviceId) return toolError("service_id required");

  const service = await db.query.services.findFirst({
    where: eq(schema.services.id, serviceId),
  });
  if (!service || service.tenantId !== tenant.id) {
    return toolError("Service not found", 404);
  }

  return toolJson({
    service_id: service.id,
    service_name: service.name,
    full_price_cents: service.priceCents,
    deposit_cents: service.depositCents,
    deposit_display: formatCurrency(service.depositCents, service.currency),
    full_price_display: formatCurrency(service.priceCents, service.currency),
    currency: service.currency,
    duration_min: service.durationMin,
  });
}
