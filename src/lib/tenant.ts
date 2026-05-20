import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";

export async function getTenantBySlug(slug: string) {
  return db.query.tenants.findFirst({
    where: eq(schema.tenants.slug, slug),
  });
}

export async function getTenantDoctors(tenantId: string) {
  return db.query.doctors.findMany({
    where: eq(schema.doctors.tenantId, tenantId),
  });
}

export async function getTenantServices(tenantId: string) {
  return db.query.services.findMany({
    where: eq(schema.services.tenantId, tenantId),
  });
}
