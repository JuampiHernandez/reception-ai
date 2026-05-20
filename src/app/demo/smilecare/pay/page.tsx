import { redirect } from "next/navigation";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";

export default async function SmileCarePayPage({
  searchParams,
}: {
  searchParams: Promise<{ appointment_id?: string }>;
}) {
  const { appointment_id: appointmentId } = await searchParams;

  if (!appointmentId) {
    redirect("/demo/smilecare");
  }

  const appointment = await db.query.appointments.findFirst({
    where: eq(schema.appointments.id, appointmentId),
  });

  if (!appointment?.paymentUrl) {
    redirect("/demo/smilecare?payment=missing");
  }

  redirect(appointment.paymentUrl);
}
