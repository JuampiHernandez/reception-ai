import "./load-env";
import { db, schema } from "../src/lib/db";
import { eq } from "drizzle-orm";

async function main() {
  const tenant = await db.query.tenants.findFirst({
    where: eq(schema.tenants.slug, "smilecare"),
  });
  if (!tenant) {
    console.log("NO smilecare tenant — run: npm run db:seed");
    return;
  }
  console.log("tenant:", tenant.name);
  console.log("apiKey in DB:", tenant.apiKey);
  console.log("env SMILECARE_TENANT_API_KEY:", process.env.SMILECARE_TENANT_API_KEY);
  console.log("keys match:", tenant.apiKey === process.env.SMILECARE_TENANT_API_KEY);

  const doctors = await db.query.doctors.findMany({
    where: eq(schema.doctors.tenantId, tenant.id),
  });
  console.log("doctors:", doctors.length);
  for (const d of doctors) console.log(`  - ${d.name} (${d.specialty})`);
}

main().catch(console.error);
