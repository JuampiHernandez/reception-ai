import { NextRequest } from "next/server";
import { authenticateTenantApiKey } from "@/lib/auth";

export async function authenticateToolRequest(
  request: NextRequest,
  tenantSlug: string
) {
  const authHeader = request.headers.get("authorization");
  const apiKey =
    authHeader?.replace(/^Bearer\s+/i, "") ??
    request.headers.get("x-api-key");
  return authenticateTenantApiKey(tenantSlug, apiKey ?? null);
}

export function toolJson(data: unknown, status = 200) {
  return Response.json(data, { status });
}

export function toolError(message: string, status = 400) {
  return Response.json({ error: message }, { status });
}
