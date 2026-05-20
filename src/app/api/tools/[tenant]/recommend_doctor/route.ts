import { NextRequest } from "next/server";
import { authenticateToolRequest, toolJson, toolError } from "@/lib/tools-auth";
import { getTenantDoctors, getTenantServices } from "@/lib/tenant";
import { recommendDoctor } from "@/lib/recommend";
import { toolLog } from "@/lib/tool-log";

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

  toolLog("recommend_doctor.success", {
    tenant: slug,
    doctor_id: recommendation.doctorId,
    service_id: recommendation.suggestedServiceId,
  });

  return toolJson({
    ...recommendation,
    doctor_id: recommendation.doctorId,
    service_id: recommendation.suggestedServiceId,
    business_name: tenant.name,
    address: tenant.address,
    suggested_service: service
      ? {
          id: service.id,
          service_id: service.id,
          name: service.name,
          deposit_cents: service.depositCents,
          price_cents: service.priceCents,
          currency: service.currency,
        }
      : null,
    booking_hint:
      "Save doctor_id and service_id for create_appointment_hold. Use exact slot_id from get_availability, not the display time.",
  });
}
