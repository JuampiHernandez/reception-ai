import { NextRequest } from "next/server";
import { authenticateToolRequest, toolJson, toolError } from "@/lib/tools-auth";
import { getTenantDoctors } from "@/lib/tenant";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tenant: string }> }
) {
  const { tenant: slug } = await params;
  const tenant = await authenticateToolRequest(request, slug);
  if (!tenant) return toolError("Unauthorized", 401);

  const doctors = await getTenantDoctors(tenant.id);
  return toolJson({
    doctors: doctors
      .filter((d) => d.isActive)
      .map((d) => ({
        id: d.id,
        name: d.name,
        specialty: d.specialty,
        bio: d.bio,
        languages: d.languages,
      })),
  });
}
