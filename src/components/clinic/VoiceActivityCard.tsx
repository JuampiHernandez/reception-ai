"use client";

import { useState } from "react";
import {
  useConversationControls,
  useConversationStatus,
  useConversationInput,
} from "@elevenlabs/react";
import { Mic, MicOff, Phone, PhoneOff, Loader2, AudioLines } from "lucide-react";

const WAVE_BARS = 48;

function BackgroundWaveform({ active, variant }: { active: boolean; variant: "agent" | "user" }) {
  return (
    <div className="pointer-events-none absolute inset-x-8 top-1/2 flex h-16 -translate-y-1/2 items-center justify-center gap-[3px] opacity-40">
      {Array.from({ length: WAVE_BARS }).map((_, i) => {
        const h = 8 + Math.sin(i * 0.45) * 12 + (i % 5) * 2;
        return (
          <div
            key={i}
            className={`w-[3px] rounded-full ${
              variant === "agent" ? "bg-teal-400" : "bg-slate-300"
            } ${active ? "animate-pulse" : ""}`}
            style={{
              height: active ? `${h}px` : "4px",
              animationDelay: `${(i % 12) * 0.06}s`,
            }}
          />
        );
      })}
    </div>
  );
}

function AgentAvatar({ active }: { active: boolean }) {
  return (
    <div className="relative">
      {active && (
        <>
          <span className="absolute -inset-3 rounded-full bg-teal-400/20 blur-md" />
          <span className="absolute -inset-1.5 animate-ping rounded-full border border-teal-300/60" />
        </>
      )}
      <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-slate-800 shadow-lg ring-4 ring-teal-100">
        <svg viewBox="0 0 48 48" className="h-12 w-12" aria-hidden>
          <circle cx="16" cy="20" r="2.5" fill="#5eead4" />
          <circle cx="32" cy="20" r="2.5" fill="#5eead4" />
          <path
            d="M14 30 Q24 38 34 30"
            fill="none"
            stroke="#5eead4"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
}

export function VoiceActivityCard({
  agentId,
  isSpeaking,
  paymentLinkSent,
}: {
  agentId: string;
  isSpeaking: boolean;
  paymentLinkSent?: boolean;
}) {
  const { startSession, endSession } = useConversationControls();
  const { status } = useConversationStatus();
  const { isMuted, setMuted } = useConversationInput();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isConnected = status === "connected";
  const isConnecting = status === "connecting";
  const isIdle = !isConnected && !isConnecting;

  let badge = "Live AI Receptionist";
  let statusLabel = "Ready";
  let statusDot = "bg-slate-400";
  let variant: "agent" | "user" = "agent";
  let waveActive = false;

  if (paymentLinkSent) {
    badge = "Booking complete";
    statusLabel = "Payment pending";
    statusDot = "bg-emerald-500";
  } else if (isConnecting) {
    badge = "Connecting…";
    statusLabel = "Connecting";
    statusDot = "bg-amber-400";
    waveActive = true;
  } else if (isConnected && isSpeaking) {
    badge = "AI receptionist is speaking";
    statusLabel = "Speaking";
    statusDot = "bg-emerald-500";
    variant = "agent";
    waveActive = true;
  } else if (isConnected) {
    badge = "Live AI Receptionist";
    statusLabel = "Listening";
    statusDot = "bg-emerald-500";
    variant = "user";
    waveActive = true;
  }

  async function handleStart() {
    setError(null);
    setBusy(true);
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      await startSession({ agentId });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Could not start call";
      setError(
        msg.includes("Permission") || msg.includes("NotAllowed")
          ? "Microphone access is required for voice booking."
          : msg
      );
    } finally {
      setBusy(false);
    }
  }

  async function handleEnd() {
    setBusy(true);
    try {
      await endSession();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      <div className="relative px-6 pb-6 pt-5">
        <div className="mb-6 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50 px-3 py-1 text-xs font-medium text-teal-800">
            <AudioLines className="h-3.5 w-3.5" />
            {badge}
          </span>
        </div>

        <div className="relative flex min-h-[200px] flex-col items-center justify-center">
          <BackgroundWaveform active={waveActive && !paymentLinkSent} variant={variant} />
          <AgentAvatar active={waveActive && !paymentLinkSent} />

          <div className="relative mt-5 flex items-center gap-2 text-sm text-slate-600">
            <span className={`h-2 w-2 rounded-full ${statusDot}`} />
            {statusLabel}
          </div>
        </div>

        {error && <p className="mt-3 text-center text-sm text-red-600">{error}</p>}

        {!paymentLinkSent && (
          <div className="mt-6 flex items-center justify-center gap-4">
            {isIdle ? (
              <button
                type="button"
                onClick={handleStart}
                disabled={busy}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-600 text-white shadow-md transition hover:bg-teal-700 disabled:opacity-60"
                aria-label="Start call"
              >
                {busy ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <Phone className="h-6 w-6" />
                )}
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setMuted(!isMuted)}
                  disabled={isConnecting}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
                  aria-label={isMuted ? "Unmute microphone" : "Mute microphone"}
                >
                  {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </button>
                <button
                  type="button"
                  onClick={handleEnd}
                  disabled={busy || isConnecting}
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500 text-white shadow-md transition hover:bg-red-600 disabled:opacity-60"
                  aria-label="End call"
                >
                  {busy ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    <PhoneOff className="h-6 w-6" />
                  )}
                </button>
              </>
            )}
          </div>
        )}

        {paymentLinkSent && (
          <p className="mt-4 text-center text-sm text-slate-600">
            Complete your deposit in the transcript below or via email.
          </p>
        )}
      </div>
    </div>
  );
}
