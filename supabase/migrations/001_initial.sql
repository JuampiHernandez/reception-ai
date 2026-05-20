-- Run in Supabase SQL Editor, or: npm run db:migrate

CREATE TABLE IF NOT EXISTS tenants (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  business_type TEXT DEFAULT 'dental',
  timezone TEXT DEFAULT 'America/Argentina/Buenos_Aires',
  address TEXT,
  phone TEXT,
  elevenlabs_agent_id TEXT,
  api_key TEXT NOT NULL,
  greeting TEXT,
  voice_id TEXT DEFAULT 'sarah',
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  tenant_id TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS doctors (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  specialty TEXT NOT NULL,
  bio TEXT,
  languages TEXT DEFAULT 'en,es',
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS services (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  duration_min INTEGER DEFAULT 30,
  price_cents INTEGER NOT NULL,
  deposit_cents INTEGER NOT NULL,
  currency TEXT DEFAULT 'usd',
  specialty_tags TEXT
);

CREATE TABLE IF NOT EXISTS availability_rules (
  id TEXT PRIMARY KEY,
  doctor_id TEXT NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS appointment_slots (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  doctor_id TEXT NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  starts_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  hold_expires_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS appointments (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  doctor_id TEXT NOT NULL REFERENCES doctors(id),
  slot_id TEXT NOT NULL REFERENCES appointment_slots(id),
  service_id TEXT NOT NULL REFERENCES services(id),
  patient_name TEXT,
  patient_phone TEXT,
  reason TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  stripe_checkout_session_id TEXT,
  payment_url TEXT,
  amount_cents INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS calls (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  caller_name TEXT,
  caller_phone TEXT,
  reason TEXT,
  booked BOOLEAN DEFAULT FALSE,
  deposit_cents INTEGER,
  deposit_status TEXT DEFAULT 'none',
  appointment_id TEXT,
  conversation_id TEXT,
  duration_sec INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payment_events (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  appointment_id TEXT,
  type TEXT NOT NULL,
  amount_cents INTEGER,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS platform_subscriptions (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  plan TEXT DEFAULT 'pro',
  status TEXT DEFAULT 'inactive'
);

CREATE TABLE IF NOT EXISTS faqs (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS business_hours (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL,
  enabled BOOLEAN DEFAULT TRUE,
  start_time TEXT DEFAULT '09:00',
  end_time TEXT DEFAULT '18:00'
);
