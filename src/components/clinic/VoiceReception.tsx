"use client";

import { useCallback, useState } from "react";
import {
  ConversationProvider,
  useConversationControls,
  useConversationStatus,
  useConversationMode,
} from "@elevenlabs/react";
import { Phone, PhoneOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConversationTranscript } from "./ConversationTranscript";
import type { PaymentLinkCard, TranscriptMessage } from "./voice-reception-types";

function extractUrls(text: string): string[] {
  const matches = text.match(/https?:\/\/[^\s]+/g);
  return matches ?? [];
}

function CallControls({ agentId }: { agentId: string }) {
  const { startSession, endSession } = useConversationControls();
  const { status } = useConversationStatus();
  const { isSpeaking } = useConversationMode();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isConnected = status === "connected";
  const isConnecting = status === "connecting";

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
    <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4">
      {!isConnected && !isConnecting ? (
        <Button
          type="button"
          onClick={handleStart}
          disabled={busy}
          className="gap-2 bg-slate-900 hover:bg-slate-800"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Phone className="h-4 w-4" />}
          Start a call
        </Button>
      ) : (
        <>
          <Button
            type="button"
            variant="outline"
            onClick={handleEnd}
            disabled={busy || isConnecting}
            className="gap-2"
          >
            <PhoneOff className="h-4 w-4" />
            End call
          </Button>
          <span className="text-sm text-slate-600">
            {isConnecting && "Connecting…"}
            {isConnected && (isSpeaking ? "Receptionist is speaking…" : "Listening…")}
          </span>
        </>
      )}
      {error && <p className="w-full text-sm text-red-600">{error}</p>}
    </div>
  );
}

function VoiceReceptionInner({
  agentId,
  messages,
  paymentLinks,
  status,
}: {
  agentId: string;
  messages: TranscriptMessage[];
  paymentLinks: PaymentLinkCard[];
  status: string;
}) {
  return (
    <>
      <ConversationTranscript
        messages={messages}
        paymentLinks={paymentLinks}
        status={status}
      />
      <CallControls agentId={agentId} />
    </>
  );
}

function ConnectedVoiceReception({
  agentId,
  messages,
  paymentLinks,
}: {
  agentId: string;
  messages: TranscriptMessage[];
  paymentLinks: PaymentLinkCard[];
}) {
  const { status } = useConversationStatus();

  return (
    <VoiceReceptionInner
      agentId={agentId}
      messages={messages}
      paymentLinks={paymentLinks}
      status={status}
    />
  );
}

export function VoiceReception({ agentId }: { agentId: string }) {
  const [messages, setMessages] = useState<TranscriptMessage[]>([]);
  const [paymentLinks, setPaymentLinks] = useState<PaymentLinkCard[]>([]);

  const onMessage = useCallback(
    (event: { source: string; message: string; event_id?: number }) => {
      const role = event.source === "user" ? "user" : "agent";
      const text = event.message?.trim();
      if (!text) return;

      setMessages((prev) => {
        if (event.event_id != null) {
          const idx = prev.findIndex((m) => m.eventId === event.event_id);
          if (idx >= 0) {
            const next = [...prev];
            next[idx] = { ...next[idx], text };
            return next;
          }
        }
        return [
          ...prev,
          {
            id: `${role}-${event.event_id ?? Date.now()}-${prev.length}`,
            role,
            text,
            eventId: event.event_id,
          },
        ];
      });

      for (const url of extractUrls(text)) {
        if (url.includes("/pay?") || url.includes("checkout.stripe.com")) {
          setPaymentLinks((prev) => {
            if (prev.some((p) => p.url === url)) return prev;
            return [
              ...prev,
              { url, label: "Pay your deposit — tap to open" },
            ];
          });
        }
      }
    },
    []
  );

  const onAgentToolResponse = useCallback(
    (response: { tool_name?: string; full_tool_result?: string }) => {
      if (response.tool_name !== "send_payment_link") return;
      try {
        const data = JSON.parse(response.full_tool_result ?? "{}") as {
          payment_page_url?: string;
          payment_url?: string;
          deposit_display?: string;
        };
        const url = data.payment_page_url ?? data.payment_url;
        if (!url) return;
        setPaymentLinks((prev) => {
          if (prev.some((p) => p.url === url)) return prev;
          return [
            ...prev,
            {
              url,
              label: `Pay deposit${data.deposit_display ? ` (${data.deposit_display})` : ""}`,
            },
          ];
        });
        setMessages((prev) => [
          ...prev,
          {
            id: `system-pay-${Date.now()}`,
            role: "agent",
            text: `Payment link ready — open it below or use: ${url}`,
          },
        ]);
      } catch {
        // ignore malformed tool output
      }
    },
    []
  );

  const onDisconnect = useCallback(() => {
    setMessages((prev) => [
      ...prev,
      {
        id: `end-${Date.now()}`,
        role: "agent",
        text: "Call ended. You can start a new call anytime.",
      },
    ]);
  }, []);

  return (
    <ConversationProvider
      onMessage={onMessage}
      onAgentToolResponse={onAgentToolResponse}
      onDisconnect={onDisconnect}
    >
      <ConnectedVoiceReception
        agentId={agentId}
        messages={messages}
        paymentLinks={paymentLinks}
      />
    </ConversationProvider>
  );
}
