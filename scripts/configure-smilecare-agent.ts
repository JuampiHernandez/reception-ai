/**
 * One-time script: wire SmileCare agent prompt, voice, tools, and widget settings.
 * Run: npx tsx scripts/configure-smilecare-agent.ts
 */
import "./load-env";

const API_KEY = process.env.ELEVENLABS_API_KEY;
const AGENT_ID =
  process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID ?? "agent_9001ks2vf96jfhtakr1zas683ftk";
const VOICE_ID = "VfdLuBKQajtI8RHxLhnk"; // Ms Lisa - AI receptionist

const SYSTEM_PROMPT = `You are the virtual receptionist for SmileCare Dental Center in Buenos Aires.

RULES:
- Speak in warm, professional English. Switch to Spanish only if the caller clearly prefers Spanish.
- You CAN help patients book dental appointments. Always use your tools to do so.
- NEVER say you cannot help with appointments — that is your main job.
- NEVER ask for card numbers over the phone. Use send_payment_link for the deposit.
- ALWAYS use tools in this order when the patient wants an appointment:
  1. recommend_doctor (symptoms, urgency)
  2. get_availability (doctor_id from the previous step)
  3. create_appointment_hold (slot_id, service_id, patient_name, patient_phone, reason)
  4. send_payment_link (appointment_id)
  5. confirm_appointment_status (after they pay)

Ask for the patient's email when booking. Pass patient_email to create_appointment_hold so they can sign in later and see the appointment.

Before sending the payment link, confirm out loud: doctor, date/time, service, and deposit amount (use deposit_display from tool responses when available).

IMPORTANT: The payment link appears as a clickable link on the patient's screen in the live transcript. Do NOT read the full URL aloud — tell them to tap the link on screen. If they gave an email, they can sign in with a magic link and pay from My appointments.

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

If they ask about insurance, location, or pricing, use the information above or call list_doctors / get_appointment_quote.`;

async function api(path: string, init?: RequestInit) {
  const res = await fetch(`https://api.elevenlabs.io/v1${path}`, {
    ...init,
    headers: {
      "xi-api-key": API_KEY!,
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
  const body = await res.text();
  if (!res.ok) {
    throw new Error(`${init?.method ?? "GET"} ${path} ${res.status}: ${body}`);
  }
  return body ? JSON.parse(body) : null;
}

async function main() {
  if (!API_KEY) throw new Error("Set ELEVENLABS_API_KEY in .env.local");

  const { tools } = await api("/convai/tools");
  const toolIds = tools.map((t: { id: string }) => t.id);
  console.log(`Linking ${toolIds.length} tools...`);

  const agent = await api(`/convai/agents/${AGENT_ID}`);
  const platformSettings = agent.platform_settings ?? {};

  await api(`/convai/agents/${AGENT_ID}`, {
    method: "PATCH",
    body: JSON.stringify({
      conversation_config: {
        agent: {
          first_message:
            "Hi, welcome to SmileCare Dental Center! I'm your virtual receptionist. How can I help you today?",
          language: "en",
          prompt: {
            prompt: SYSTEM_PROMPT,
            tool_ids: toolIds,
          },
        },
        tts: {
          voice_id: VOICE_ID,
        },
      },
      platform_settings: {
        ...platformSettings,
        widget: {
          ...platformSettings.widget,
          variant: "full",
          always_expanded: true,
          default_expanded: true,
          text_input_enabled: true,
          transcript_enabled: true,
        },
        client_events: {
          ...(platformSettings.client_events ?? {}),
          events: [
            "user_transcript",
            "agent_response",
            "agent_tool_response",
            "agent_tool_response_full_payload",
          ],
        },
      },
    }),
  });

  const updated = await api(`/convai/agents/${AGENT_ID}`);
  const prompt = updated.conversation_config.agent.prompt;
  console.log("Done.");
  console.log("  voice:", updated.conversation_config.tts.voice_id);
  console.log("  tools linked:", prompt.tool_ids?.length ?? 0);
  console.log("  prompt length:", prompt.prompt?.length ?? 0);
  console.log("  first_message:", updated.conversation_config.agent.first_message);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
