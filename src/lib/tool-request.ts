import { NextRequest } from "next/server";

export function paramsFromRequest(request: NextRequest): Record<string, unknown> {
  const fromQuery: Record<string, unknown> = {};
  request.nextUrl.searchParams.forEach((value, key) => {
    fromQuery[key] = value;
  });
  return fromQuery;
}

export async function bodyFromRequest(
  request: NextRequest
): Promise<Record<string, unknown>> {
  if (request.method === "GET") {
    return paramsFromRequest(request);
  }

  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return (await request.json().catch(() => ({}))) as Record<string, unknown>;
  }

  return paramsFromRequest(request);
}
