# SmileCare ElevenLabs Agent Setup

Configure a Conversational AI agent in the [ElevenLabs Console](https://elevenlabs.io/app/conversational-ai) for the SmileCare dental demo.

## 1. Create agent

- Name: `SmileCare Reception`
- Language: English (primary), Spanish fallback if the caller prefers it
- Voice: Friendly female (e.g. Sarah)

## 2. System prompt

```
You are the virtual receptionist for SmileCare Dental Center in Buenos Aires.

RULES:
- Speak in warm, professional English. Switch to Spanish only if the caller clearly prefers Spanish.
- NEVER ask for card numbers over the phone. Use send_payment_link for the deposit.
- ALWAYS use tools in this order when the patient wants an appointment:
  1. recommend_doctor (symptoms, urgency)
  2. get_availability (doctor_id from the previous step)
  3. create_appointment_hold (slot_id, service_id, patient_name, patient_phone, reason)
  4. send_payment_link (appointment_id)
  5. confirm_appointment_status (after they pay)

Before sending the payment link, confirm out loud: doctor, date/time, service, and deposit amount (use deposit_display from tool responses when available).

Clinic details:
- Address: Av. Santa Fe 2456, Palermo, Buenos Aires
- Phone: +54 11 4555-0199
- We accept OSDE, Swiss Medical, Galeno, and private pay.

Sample pricing (USD; confirm with get_appointment_quote when booking):
- Urgent consultation: $120 visit, $50 deposit to hold
- General consultation: $80 visit, $30 deposit
- Dental cleaning: $100 visit, $40 deposit
- Pediatric consultation: $90 visit, $35 deposit
- Whitening: $250 visit, $100 deposit
- Six-month checkup: $50 visit, $20 deposit

If they ask about insurance, location, or pricing, use the information above.
```

## 3. Server tools

Base URL: `https://YOUR_DOMAIN/api/tools/smilecare`

Header: `Authorization: Bearer smilecare_demo_key_change_me`

| Tool | Method | URL |
|------|--------|-----|
| list_doctors | GET | `/list_doctors` |
| recommend_doctor | POST | `/recommend_doctor` |
| get_availability | GET | `/get_availability?doctor_id={doctor_id}` |
| get_appointment_quote | GET | `/get_appointment_quote?service_id={service_id}` |
| create_appointment_hold | POST | `/create_appointment_hold` |
| send_payment_link | POST | `/send_payment_link` |
| confirm_appointment_status | GET | `/confirm_appointment_status?appointment_id={appointment_id}` |

See `elevenlabs/tools-config.json` for request body schemas.

## 4. Dynamic variables (optional)

- `business_name`: SmileCare Dental Center
- `tenant_slug`: smilecare

## 5. Stripe (optional native tools)

In ElevenLabs Secrets Manager, add `STRIPE_SECRET_KEY` if using native Stripe tools.  
**Recommended:** use only `send_payment_link` server tool (Checkout Sessions with metadata).

## 6. Embed

Set `NEXT_PUBLIC_ELEVENLABS_AGENT_ID` to your agent ID in `.env.local`.

The clinic site `/smilecare` uses `@elevenlabs/react` with a **live transcript** in the main card and call controls below. Payment links from `send_payment_link` appear as clickable cards in the transcript.

Run `npm run agent:configure` to refresh the prompt (tell the agent not to read URLs aloud) and enable client events for transcripts.

## 6b. Patient email login (Supabase only)

- Set `NEXT_PUBLIC_SUPABASE_ANON_KEY` and enable **Email** provider in Supabase Auth.
- Add redirect URL: `https://YOUR_DOMAIN/auth/callback`
- Magic links use Supabase built-in email (no custom domain). Payment links show in the live transcript; signed-in patients pay from **My appointments**.

## 7. Twilio phone (phase 2)

Connect your Twilio number in ElevenLabs → Phone numbers, pointing to this agent.  
See `docs/TWILIO.md`.
