import { NextRequest } from "next/server";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { verifyPassword, createSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();
  const user = await db.query.users.findFirst({
    where: eq(schema.users.email, email),
  });

  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return Response.json({ error: "Invalid credentials" }, { status: 401 });
  }

  await createSession(user.id);
  return Response.json({ success: true });
}
