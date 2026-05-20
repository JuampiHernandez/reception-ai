import { NextRequest } from "next/server";
import { authenticateToolRequest, toolJson, toolError } from "@/lib/tools-auth";
import { getTenantDoctors, getTenantServices } from "@/lib/tenant";
import { recommendDoctor } from "@/lib/recommend";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ tenant: string }> }
) {
  const { tenant: slug } = await params;
  const tenant = await authenticateToolRequest(request, slug);
  if (!tenant) return toolError("Unauthorized", 401);

  const body = await request.json().catch(() => ({}));
  const doctors = await getTenantDoctors(tenant.id);
  const services = await getTenantServices(tenant.id);

  const recommendation = recommendDoctor(
    doctors.filter((d) => d.isActive).map((d) => ({
      id: d.id,
      name: d.name,
      specialty: d.specialty,
    })),
    services.map((s) => ({ id: s.id, specialtyTags: s.specialtyTags })),
    {
      symptoms: body.symptoms ?? body.reason,
      urgency: body.urgency,
      patientType: body.patient_type ?? body.patientType,
      reason: body.reason,
    }
  );

  if (!recommendation) return toolError("No doctors available", 404);

  const service = services.find((s) => s.id === recommendation.suggestedServiceId);

  return toolJson({
    ...recommendation,
    business_name: tenant.name,
    address: tenant.address,
    suggested_service: service
      ? {
          id: service.id,
          name: service.name,
          deposit_cents: service.depositCents,
          price_cents: service.priceCents,
          currency: service.currency,
        }
      : null,
  });
}
