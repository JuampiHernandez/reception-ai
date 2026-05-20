import "./load-env";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import { db, schema } from "../src/lib/db";
import { generateSlotsForDoctor } from "../src/lib/slots";

const TENANT_ID = "tenant_smilecare";
const API_KEY = process.env.SMILECARE_TENANT_API_KEY || "smilecare_demo_key_change_me";

async function seed() {
  await db.delete(schema.paymentEvents);
  await db.delete(schema.calls);
  await db.delete(schema.appointments);
  await db.delete(schema.appointmentSlots);
  await db.delete(schema.availabilityRules);
  await db.delete(schema.businessHours);
  await db.delete(schema.faqs);
  await db.delete(schema.services);
  await db.delete(schema.doctors);
  await db.delete(schema.platformSubscriptions);
  await db.delete(schema.users);
  await db.delete(schema.tenants);

  await db.insert(schema.tenants).values({
    id: TENANT_ID,
    slug: "smilecare",
    name: "SmileCare Dental Center",
    businessType: "dental",
    timezone: "America/Argentina/Buenos_Aires",
    address: "Av. Santa Fe 2456, Palermo, Buenos Aires",
    phone: "+54 11 4555-0199",
    apiKey: API_KEY,
    elevenLabsAgentId: process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID || "",
    greeting:
      "Hello, welcome to SmileCare Dental Center. I'm the virtual receptionist. How can I help you today?",
    voiceId: "sarah",
  });

  const passwordHash = await bcrypt.hash("demo1234", 10);
  await db.insert(schema.users).values({
    id: "user_smilecare",
    email: "smilecare@demo.reception.ai",
    passwordHash,
    tenantId: TENANT_ID,
    name: "Dr. Ana Martínez",
  });

  const doctors = [
    {
      id: "doc_ana",
      tenantId: TENANT_ID,
      name: "Dr. Ana Martínez",
      specialty: "endodontics",
      bio: "Endodontics specialist and dental emergencies.",
    },
    {
      id: "doc_carlos",
      tenantId: TENANT_ID,
      name: "Dr. Carlos Ruiz",
      specialty: "general",
      bio: "General dentistry, cleanings, and consultations.",
    },
    {
      id: "doc_lucia",
      tenantId: TENANT_ID,
      name: "Dr. Lucía Fernández",
      specialty: "pediatrics",
      bio: "Pediatric dentist for children and teens.",
    },
  ];
  await db.insert(schema.doctors).values(doctors);

  const services = [
    {
      id: "svc_urgent",
      tenantId: TENANT_ID,
      name: "Urgent consultation",
      description: "Acute pain, priority evaluation",
      durationMin: 45,
      priceCents: 12000,
      depositCents: 5000,
      currency: "usd",
      specialtyTags: "urgent,endodontics",
    },
    {
      id: "svc_consult",
      tenantId: TENANT_ID,
      name: "General consultation",
      description: "First visit or follow-up",
      durationMin: 30,
      priceCents: 8000,
      depositCents: 3000,
      currency: "usd",
      specialtyTags: "consultation,general",
    },
    {
      id: "svc_clean",
      tenantId: TENANT_ID,
      name: "Dental cleaning",
      description: "Prophylaxis and cleaning",
      durationMin: 40,
      priceCents: 10000,
      depositCents: 4000,
      currency: "usd",
      specialtyTags: "cleaning,general",
    },
    {
      id: "svc_pediatric",
      tenantId: TENANT_ID,
      name: "Pediatric consultation",
      description: "Care for children",
      durationMin: 30,
      priceCents: 9000,
      depositCents: 3500,
      currency: "usd",
      specialtyTags: "pediatric,pediatrics",
    },
    {
      id: "svc_whitening",
      tenantId: TENANT_ID,
      name: "Teeth whitening",
      description: "Cosmetic dentistry",
      durationMin: 60,
      priceCents: 25000,
      depositCents: 10000,
      currency: "usd",
      specialtyTags: "cosmetic,general",
    },
    {
      id: "svc_checkup",
      tenantId: TENANT_ID,
      name: "Six-month checkup",
      description: "Routine exam",
      durationMin: 20,
      priceCents: 5000,
      depositCents: 2000,
      currency: "usd",
      specialtyTags: "consultation,general",
    },
  ];
  await db.insert(schema.services).values(services);

  const rules = [
    { dayOfWeek: 1, startTime: "09:00", endTime: "17:00" },
    { dayOfWeek: 2, startTime: "09:00", endTime: "17:00" },
    { dayOfWeek: 3, startTime: "09:00", endTime: "17:00" },
    { dayOfWeek: 4, startTime: "09:00", endTime: "17:00" },
    { dayOfWeek: 5, startTime: "09:00", endTime: "15:00" },
  ];

  for (const doc of doctors) {
    for (const r of rules) {
      await db.insert(schema.availabilityRules).values({
        id: randomUUID(),
        doctorId: doc.id,
        dayOfWeek: r.dayOfWeek,
        startTime: r.startTime,
        endTime: r.endTime,
      });
    }
    const slots = generateSlotsForDoctor(doc.id, TENANT_ID, rules, 14);
    if (slots.length > 0) {
      await db.insert(schema.appointmentSlots).values(
        slots.map((s) => ({
          id: s.id,
          tenantId: s.tenantId,
          doctorId: s.doctorId,
          startsAt: s.startsAt,
          status: s.status,
        }))
      );
    }
  }

  const faqData = [
    {
      question: "Do you accept insurance?",
      answer: "Yes. We work with OSDE, Swiss Medical, Galeno, and private pay patients.",
    },
    {
      question: "Where are you located?",
      answer: "Av. Santa Fe 2456, Palermo, Buenos Aires. Metro Line D.",
    },
    {
      question: "How much does an urgent visit cost?",
      answer: "Urgent consultation is $120, with a $50 deposit to hold your appointment.",
    },
  ];
  await db.insert(schema.faqs).values(
    faqData.map((f) => ({
      id: randomUUID(),
      tenantId: TENANT_ID,
      question: f.question,
      answer: f.answer,
    }))
  );

  for (let d = 0; d <= 6; d++) {
    await db.insert(schema.businessHours).values({
      id: randomUUID(),
      tenantId: TENANT_ID,
      dayOfWeek: d,
      enabled: d >= 1 && d <= 5,
      startTime: "09:00",
      endTime: d === 5 ? "15:00" : "18:00",
    });
  }

  await db.insert(schema.calls).values([
    {
      id: randomUUID(),
      tenantId: TENANT_ID,
      callerName: "María González",
      callerPhone: "+54 11 5555-1234",
      reason: "Urgent consultation - tooth pain",
      booked: true,
      depositCents: 5000,
      depositStatus: "paid",
      durationSec: 142,
    },
    {
      id: randomUUID(),
      tenantId: TENANT_ID,
      callerName: "Juan Pérez",
      callerPhone: "+54 11 5555-5678",
      reason: "Cleaning appointment",
      booked: true,
      depositCents: 4000,
      depositStatus: "paid",
      durationSec: 98,
    },
    {
      id: randomUUID(),
      tenantId: TENANT_ID,
      callerName: "Laura Sánchez",
      callerPhone: "+54 11 5555-9012",
      reason: "Pediatric checkup",
      booked: false,
      depositStatus: "pending",
      durationSec: 67,
    },
  ]);

  console.log("SmileCare seed complete");
  console.log("Login: smilecare@demo.reception.ai / demo1234");
  console.log("API Key:", API_KEY);
}

seed().catch(console.error);
