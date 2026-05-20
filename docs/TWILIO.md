# Twilio Phone Integration (Phase 2)

## Overview

Connect a Twilio phone number to your ElevenLabs SmileCare agent so callers can book appointments by phone.

## Steps

1. Create a [Twilio](https://www.twilio.com) account and buy a phone number.
2. In ElevenLabs Console → your agent → **Phone numbers** → add Twilio integration.
3. Set environment variables:

```env
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1...
```

4. The webhook endpoint `POST /api/twilio/voice` is a stub that returns TwiML to forward to ElevenLabs (configure forwarding in ElevenLabs dashboard directly for simplest setup).

## Demo tip

For the hackathon video, record:
1. Web widget demo (primary)
2. Optional B-roll: phone ringing → conversation → dashboard shows confirmed booking
