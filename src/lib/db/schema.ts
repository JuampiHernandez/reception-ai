import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";

export const tenants = pgTable("tenants", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  businessType: text("business_type").default("dental"),
  timezone: text("timezone").default("America/Argentina/Buenos_Aires"),
  address: text("address"),
  phone: text("phone"),
  elevenLabsAgentId: text("elevenlabs_agent_id"),
  apiKey: text("api_key").notNull(),
  greeting: text("greeting"),
  voiceId: text("voice_id").default("sarah"),
  stripeCustomerId: text("stripe_customer_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  tenantId: text("tenant_id")
    .notNull()
    .references(() => tenants.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const doctors = pgTable("doctors", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id")
    .notNull()
    .references(() => tenants.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  specialty: text("specialty").notNull(),
  bio: text("bio"),
  languages: text("languages").default("en,es"),
  isActive: boolean("is_active").default(true),
});

export const services = pgTable("services", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id")
    .notNull()
    .references(() => tenants.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  durationMin: integer("duration_min").default(30),
  priceCents: integer("price_cents").notNull(),
  depositCents: integer("deposit_cents").notNull(),
  currency: text("currency").default("usd"),
  specialtyTags: text("specialty_tags"),
});

export const availabilityRules = pgTable("availability_rules", {
  id: text("id").primaryKey(),
  doctorId: text("doctor_id")
    .notNull()
    .references(() => doctors.id, { onDelete: "cascade" }),
  dayOfWeek: integer("day_of_week").notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
});

export const appointmentSlots = pgTable("appointment_slots", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id")
    .notNull()
    .references(() => tenants.id, { onDelete: "cascade" }),
  doctorId: text("doctor_id")
    .notNull()
    .references(() => doctors.id, { onDelete: "cascade" }),
  startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
  status: text("status").notNull().default("open"),
  holdExpiresAt: timestamp("hold_expires_at", { withTimezone: true }),
});

export const appointments = pgTable("appointments", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id")
    .notNull()
    .references(() => tenants.id, { onDelete: "cascade" }),
  doctorId: text("doctor_id")
    .notNull()
    .references(() => doctors.id),
  slotId: text("slot_id")
    .notNull()
    .references(() => appointmentSlots.id),
  serviceId: text("service_id")
    .notNull()
    .references(() => services.id),
  patientName: text("patient_name"),
  patientPhone: text("patient_phone"),
  patientEmail: text("patient_email"),
  reason: text("reason"),
  status: text("status").notNull().default("pending"),
  stripeCheckoutSessionId: text("stripe_checkout_session_id"),
  paymentUrl: text("payment_url"),
  amountCents: integer("amount_cents"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  confirmedAt: timestamp("confirmed_at", { withTimezone: true }),
});

export const calls = pgTable("calls", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id")
    .notNull()
    .references(() => tenants.id, { onDelete: "cascade" }),
  callerName: text("caller_name"),
  callerPhone: text("caller_phone"),
  reason: text("reason"),
  booked: boolean("booked").default(false),
  depositCents: integer("deposit_cents"),
  depositStatus: text("deposit_status").default("none"),
  appointmentId: text("appointment_id"),
  conversationId: text("conversation_id"),
  durationSec: integer("duration_sec"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const paymentEvents = pgTable("payment_events", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id")
    .notNull()
    .references(() => tenants.id, { onDelete: "cascade" }),
  appointmentId: text("appointment_id"),
  type: text("type").notNull(),
  amountCents: integer("amount_cents"),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const platformSubscriptions = pgTable("platform_subscriptions", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id")
    .notNull()
    .references(() => tenants.id, { onDelete: "cascade" }),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  plan: text("plan").default("pro"),
  status: text("status").default("inactive"),
});

export const faqs = pgTable("faqs", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id")
    .notNull()
    .references(() => tenants.id, { onDelete: "cascade" }),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
});

export const businessHours = pgTable("business_hours", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id")
    .notNull()
    .references(() => tenants.id, { onDelete: "cascade" }),
  dayOfWeek: integer("day_of_week").notNull(),
  enabled: boolean("enabled").default(true),
  startTime: text("start_time").default("09:00"),
  endTime: text("end_time").default("18:00"),
});
