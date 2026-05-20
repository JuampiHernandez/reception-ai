# Environment variables — where to get each one

Copy `.env.example` to `.env.local` and fill in values **one by one**.

---

## Required to run the app

### 1. `DATABASE_URL` (Supabase Postgres)

**What it is:** Connection string to your Supabase database.

**Where to get it:**
1. Go to [supabase.com](https://supabase.com) → your project
2. **Project Settings** (gear) → **Database**
3. Under **Connection string**, choose **URI**
4. For **local dev / seed**, use **Direct connection** (simplest):
   - Host: `db.kfwwbldrhcmmelguhris.supabase.co`
   - Port: **5432**
   - User: `postgres` (not `postgres.projectref`)
5. Replace `[YOUR-PASSWORD]` with your database password

**Example (direct — use this if pooler fails):**
```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.kfwwbldrhcmmelguhris.supabase.co:5432/postgres
```

**Pooler (production / serverless):** copy exact URI from dashboard — user must be `postgres.[project-ref]` on port 6543, and the `aws-0-...` host must match what Supabase shows (not guessed).

**Then run once:**
```bash
npm run db:migrate   # creates tables in Supabase
npm run db:seed      # SmileCare demo data
```

---

### 2. `NEXT_PUBLIC_APP_URL`

**What it is:** Public URL of your app (used for Stripe redirect URLs and ElevenLabs tool URLs).

**Where to get it:** You set it yourself.

| Environment | Value |
|-------------|--------|
| Local dev | `http://localhost:3000` (or `3002` / `3003` if port busy) |
| Production | `https://your-app.vercel.app` |

---

### 3. `SMILECARE_TENANT_API_KEY`

**What it is:** Secret key ElevenLabs sends when calling your booking API.

**Where to get it:** **You invent it** — any long random string, e.g. `smilecare_demo_key_change_me`.

Use the **same value** in:
- `.env.local`
- ElevenLabs agent → each server tool → Header `Authorization: Bearer YOUR_KEY`

---

## Required for voice demo (ElevenLabs)

### 4. `NEXT_PUBLIC_ELEVENLABS_AGENT_ID`

**What it is:** ID of your Conversational AI agent (web widget on `/demo/smilecare`).

**Where to get it:**
1. [elevenlabs.io](https://elevenlabs.io) → **Agents** (or Conversational AI)
2. Create agent → open it
3. Copy **Agent ID** from the URL or agent settings

```env
NEXT_PUBLIC_ELEVENLABS_AGENT_ID=agent_xxxxxxxxxxxx
```

**Also configure server tools** using `elevenlabs/AGENT_SETUP.md` with base URL:
`{NEXT_PUBLIC_APP_URL}/api/tools/smilecare/`

---

### 5. `ELEVENLABS_API_KEY` (optional for widget; useful for API/scripts)

**Where to get it:**
1. ElevenLabs → profile → **API Keys**
2. Create key → copy `sk_...`

---

## Stripe (optional — mock payments work without these)

### 6. `STRIPE_SECRET_KEY`

**Where:** [dashboard.stripe.com](https://dashboard.stripe.com) → **Developers** → **API keys** → **Secret key** (test mode)

```env
STRIPE_SECRET_KEY=sk_test_...
```

---

### 7. `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

**Where:** Same page → **Publishable key** (test mode)

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

---

### 8. `STRIPE_WEBHOOK_SECRET`

**Where:**
1. Stripe Dashboard → **Developers** → **Webhooks**
2. **Add endpoint** → URL: `https://YOUR_DOMAIN/api/webhooks/stripe`
3. Events: `checkout.session.completed`
4. Copy **Signing secret** (`whsec_...`)

Local testing: use [Stripe CLI](https://stripe.com/docs/stripe-cli):
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

---

### 9. `STRIPE_PRICE_STARTER` / `STRIPE_PRICE_PRO` / `STRIPE_PRICE_BUSINESS`

**Where:**
1. Stripe → **Product catalog** → create products/prices (recurring monthly)
2. Copy each **Price ID** (`price_...`)

Only needed if you test the landing page “Start free trial” subscription buttons.

---

## Supabase Auth (patient magic-link login)

### 10. `NEXT_PUBLIC_SUPABASE_URL`

**Where:** Supabase → **Project Settings** → **API** → **Project URL**

### 11. `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Where:** Same page → **anon public** key

### 12. `SUPABASE_SERVICE_ROLE_KEY`

**Where:** Same page → **service_role** key (keep secret, never expose in browser)

**Dashboard checklist (Authentication):**

| Setting | What to use |
|--------|-------------|
| **Providers → Email** | Enabled |
| **URL Configuration → Site URL** | Production: `https://reception-ai-delta.vercel.app`. Local-only testing: `http://localhost:3000` |
| **Redirect URLs** | Must include `{APP_URL}/auth/callback` for prod and localhost |
| **Emails → Magic link** | Default template is fine; links use `emailRedirectTo` from the app |

Magic-link emails are sent **by Supabase** built-in email (free tier, rate-limited). No custom domain required.

**Payment / checkout:** Supabase only sends auth emails, not custom receipts. Patients pay via the **live transcript** during the call, or after **Sign in** → **My appointments** (same email used when booking).

---

## Twilio (optional — phone demo only)

### 13. `TWILIO_ACCOUNT_SID` + `TWILIO_AUTH_TOKEN`

**Where:** [console.twilio.com](https://console.twilio.com) → Account Info

### 14. `TWILIO_PHONE_NUMBER`

**Where:** Twilio → **Phone Numbers** → buy a number → copy E.164 format (`+1...`)

Prefer wiring the number in **ElevenLabs agent → Phone numbers** directly; see `docs/TWILIO.md`.

---

## Minimum `.env.local` to start today

```env
DATABASE_URL=postgresql://...your supabase pooler uri...
NEXT_PUBLIC_APP_URL=http://localhost:3000
SMILECARE_TENANT_API_KEY=smilecare_demo_key_change_me
NEXT_PUBLIC_ELEVENLABS_AGENT_ID=agent_xxx
```

Then:
```bash
npm run db:setup
kill $(lsof -t -i:3000) 2>/dev/null; npm run dev   # one dev server only
```

Login: `smilecare@demo.reception.ai` / `demo1234`
