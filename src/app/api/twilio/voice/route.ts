import { NextRequest } from "next/server";

/**
 * Twilio voice webhook stub.
 * For production: configure ElevenLabs native Twilio integration in the console
 * rather than proxying through this route.
 */
export async function POST(request: NextRequest) {
  const configured = Boolean(
    process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_PHONE_NUMBER
  );

  const twiml = configured
    ? `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say language="en-US">Connecting you to SmileCare Dental. Please hold.</Say>
  <Pause length="1"/>
  <Say>Configure ElevenLabs phone integration in the agent console for full AI conversation.</Say>
</Response>`
    : `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say>Reception dot A I demo. Twilio is not configured. Use the web demo at reception dot A I slash demo slash smilecare.</Say>
</Response>`;

  return new Response(twiml, {
    headers: { "Content-Type": "text/xml" },
  });
}
