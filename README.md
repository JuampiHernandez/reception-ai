# Reception.ai

**The AI receptionist that never misses a call.**

Multi-tenant voice receptionist SaaS built for the **ElevenLabs × Stripe Hackathon** (#ElevenHacks). Answers calls 24/7, recommends specialists, books appointments, and collects deposits via Stripe Checkout — powered by ElevenLabs Conversational AI.

## Demo: SmileCare Dental Center

Live demo: [/demo/smilecare](http://localhost:3000/demo/smilecare)

**Dashboard login:** `smilecare@demo.reception.ai` / `demo1234`

### Demo flow (English)

1. "Hi, I'd like an appointment. I have tooth pain on the right side."
2. Agent recommends **Dr. Ana Martínez** (endodontics)
3. Offers availability → books slot → sends **Stripe payment link**
4. Payment confirms → appointment appears in dashboard

## Quick start

```bash
npm install
cp .env.example .env.local
# Fill DATABASE_URL from Supabase — see docs/ENV_SETUP.md
npm run db:setup
npm run dev
```

Open http://localhost:3000 (if port busy, use the URL shown in the terminal).

**Stop duplicate dev servers:** `kill 87609` or `lsof -ti:3000 | xargs kill`

## Environment variables

**Full guide (each variable + where to get it):** [docs/ENV_SETUP.md](docs/ENV_SETUP.md)

Minimum in `.env.local`:

| Variable | Required? |
|----------|-----------|
| `DATABASE_URL` | Yes — Supabase Postgres URI |
| `NEXT_PUBLIC_APP_URL` | Yes |
| `SMILECARE_TENANT_API_KEY` | Yes — you choose the value |
| `NEXT_PUBLIC_ELEVENLABS_AGENT_ID` | Yes for voice demo |
| Stripe keys | Optional (mock payments work) |
| Twilio | Optional |

## ElevenLabs agent

See [elevenlabs/AGENT_SETUP.md](elevenlabs/AGENT_SETUP.md) for system prompt and server tool URLs.

Tool API base: `http://localhost:3000/api/tools/smilecare/`

## Architecture

- **Next.js 16** — landing, dashboard, API routes
- **Supabase** (Postgres + Drizzle ORM) — multi-tenant data
- **ElevenLabs** — conversational AI + web widget
- **Stripe Checkout** — appointment deposits + SaaS subscriptions
- **Twilio** (optional) — phone calls

## Hackathon submission

### Video checklist

See [docs/VIDEO_SUBMISSION.md](docs/VIDEO_SUBMISSION.md)

### Social post

Tag **@stripe** and **@elevenlabsio** with **#ElevenHacks**

## Stripe test card

`4242 4242 4242 4242` — any future expiry, any CVC

Without Stripe keys, mock payment flow auto-confirms on success URL.

## License

MIT
