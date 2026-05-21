import { NextRequest } from "next/server";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";
import { getStripe } from "@/lib/stripe";
import { provisionPlatformSubscription } from "@/lib/subscription-provisioning";
import { sendSubscriptionReceiptEmail } from "@/lib/email";
import { PLANS, isPlanSlug } from "@/lib/plans";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  const stripe = getStripe();
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  let event: Stripe.Event;

  if (stripe && process.env.STRIPE_WEBHOOK_SECRET && sig) {
    try {
      event = stripe.webhooks.constructEvent(
        body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch {
      return Response.json({ error: "Invalid signature" }, { status: 400 });
    }
  } else {
    event = JSON.parse(body) as Stripe.Event;
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const appointmentId = session.metadata?.appointment_id;
    const tenantId = session.metadata?.tenant_id;

    if (appointmentId) {
      const appointment = await db.query.appointments.findFirst({
        where: eq(schema.appointments.id, appointmentId),
      });

      if (appointment) {
        const checkoutEmail = session.customer_details?.email?.trim().toLowerCase();
        await db
          .update(schema.appointments)
          .set({
            status: "confirmed",
            confirmedAt: new Date(),
            ...(checkoutEmail && !appointment.patientEmail
              ? { patientEmail: checkoutEmail }
              : {}),
          })
          .where(eq(schema.appointments.id, appointmentId));

        await db
          .update(schema.appointmentSlots)
          .set({ status: "booked", holdExpiresAt: null })
          .where(eq(schema.appointmentSlots.id, appointment.slotId));

        await db.insert(schema.paymentEvents).values({
          id: randomUUID(),
          tenantId: appointment.tenantId,
          appointmentId,
          type: "deposit_collected",
          amountCents: appointment.amountCents ?? session.amount_total ?? 0,
          description: "Deposit paid via Stripe Checkout",
        });

        if (appointment.patientName) {
          await db.insert(schema.calls).values({
            id: randomUUID(),
            tenantId: appointment.tenantId,
            callerName: appointment.patientName,
            callerPhone: appointment.patientPhone,
            reason: appointment.reason ?? "Appointment booked",
            booked: true,
            depositCents: appointment.amountCents,
            depositStatus: "paid",
            appointmentId,
          });
        }
      }
    }

    if (session.metadata?.type === "platform_subscription") {
      const planSlug = session.metadata.plan;
      const plan = isPlanSlug(planSlug) ? planSlug : "pro";
      const email =
        session.customer_details?.email?.trim().toLowerCase() ||
        session.metadata.customer_email?.trim().toLowerCase();

      if (email) {
        const { tempPassword, isNewAccount } = await provisionPlatformSubscription({
          email,
          businessName: session.metadata.business_name,
          plan,
          stripeCustomerId: (session.customer as string) || "",
          stripeSubscriptionId: (session.subscription as string) || "",
        });

        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
        const planInfo = PLANS[plan];

        await sendSubscriptionReceiptEmail({
          to: email,
          planName: planInfo.name,
          priceDisplay: planInfo.price,
          businessName: session.metadata.business_name,
          loginUrl: `${baseUrl}/login`,
          tempPassword,
          isNewAccount,
        });
      } else if (tenantId) {
        await db.insert(schema.platformSubscriptions).values({
          id: randomUUID(),
          tenantId,
          stripeCustomerId: session.customer as string,
          stripeSubscriptionId: session.subscription as string,
          plan: isPlanSlug(planSlug) ? planSlug : "pro",
          status: "active",
        });
      }
    }
  }

  return Response.json({ received: true });
}
