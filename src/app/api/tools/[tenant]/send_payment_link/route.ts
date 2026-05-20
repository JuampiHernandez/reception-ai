import { NextRequest } from "next/server";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";
import { authenticateToolRequest, toolJson, toolError } from "@/lib/tools-auth";
import { createAppointmentCheckout } from "@/lib/stripe";
import { bodyFromRequest } from "@/lib/tool-request";
import { toolLog } from "@/lib/tool-log";
import { clinicPath } from "@/lib/routes";
import { sendPaymentLinkEmail } from "@/lib/email";
import { formatDateTime } from "@/lib/utils";

async function handleSendPaymentLink(request: NextRequest, slug: string) {
  const tenant = await authenticateToolRequest(request, slug);
  if (!tenant) return toolError("Unauthorized", 401);

  const body = await bodyFromRequest(request);
  const appointmentId = body.appointment_id ?? body.appointmentId;
  if (!appointmentId || typeof appointmentId !== "string") {
    return toolError("appointment_id required");
  }

  toolLog("send_payment_link.request", {
    tenant: slug,
    method: request.method,
    appointmentId,
  });

  const appointment = await db.query.appointments.findFirst({
    where: eq(schema.appointments.id, appointmentId),
  });
  if (!appointment || appointment.tenantId !== tenant.id) {
    return toolError("Appointment not found", 404);
  }

  const service = await db.query.services.findFirst({
    where: eq(schema.services.id, appointment.serviceId),
  });
  if (!service) return toolError("Service not found", 404);

  const slot = await db.query.appointmentSlots.findFirst({
    where: eq(schema.appointmentSlots.id, appointment.slotId),
  });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const { url, sessionId } = await createAppointmentCheckout({
    appointmentId,
    tenantSlug: slug,
    serviceName: `${service.name} - ${tenant.name}`,
    amountCents: service.depositCents,
    currency: service.currency ?? "usd",
    patientName: appointment.patientName ?? undefined,
    successUrl: `${baseUrl}${clinicPath(slug, "success")}?appointment_id=${appointmentId}`,
    cancelUrl: `${baseUrl}${clinicPath(slug)}?cancelled=1`,
  });

  await db
    .update(schema.appointments)
    .set({
      paymentUrl: url,
      stripeCheckoutSessionId: sessionId,
      status: "pending_payment",
    })
    .where(eq(schema.appointments.id, appointmentId));

  await db.insert(schema.paymentEvents).values({
    id: randomUUID(),
    tenantId: tenant.id,
    appointmentId,
    type: "payment_link_sent",
    amountCents: service.depositCents,
    description: `Payment link sent for ${service.name}`,
  });

  toolLog("send_payment_link.success", { tenant: slug, appointmentId });

  const paymentPageUrl = `${baseUrl}${clinicPath(slug, "pay")}?appointment_id=${appointmentId}`;
  const depositDisplay = `$${(service.depositCents / 100).toFixed(2)}`;

  let emailSent = false;
  if (appointment.patientEmail) {
    const emailResult = await sendPaymentLinkEmail({
      to: appointment.patientEmail,
      patientName: appointment.patientName ?? undefined,
      clinicName: tenant.name,
      paymentPageUrl,
      depositDisplay,
      serviceName: service.name,
      slotDisplay: slot ? formatDateTime(slot.startsAt) : undefined,
    });
    emailSent = emailResult.sent;
  }

  return toolJson({
    appointment_id: appointmentId,
    payment_url: url,
    payment_page_url: paymentPageUrl,
    amount_cents: service.depositCents,
    deposit_display: depositDisplay,
    currency: service.currency,
    email_sent: emailSent,
    message: emailSent
      ? `Payment link sent by email to ${appointment.patientEmail}. A pay button also appears on the patient's screen. Tell them briefly the link is in their inbox — do NOT read any URL aloud. End the conversation; do not wait for them to speak again.`
      : `Payment link is on the patient's screen (pay button in transcript). Do NOT read any URL aloud. If they shared an email, mention they can also sign in at ${baseUrl}${clinicPath(slug, "login")}. End the conversation; do not wait for them to speak again.`,
  });
}

export async function GET(
  request: NextRequest,
  ctx: { params: Promise<{ tenant: string }> }
) {
  const { tenant: slug } = await ctx.params;
  return handleSendPaymentLink(request, slug);
}

export async function POST(
  request: NextRequest,
  ctx: { params: Promise<{ tenant: string }> }
) {
  const { tenant: slug } = await ctx.params;
  return handleSendPaymentLink(request, slug);
}
