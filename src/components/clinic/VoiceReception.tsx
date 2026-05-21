"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import {
  ConversationProvider,
  useConversationControls,
  useConversationStatus,
  useConversationMode,
} from "@elevenlabs/react";
import { ConversationTranscript } from "./ConversationTranscript";
import { VoiceActivityCard } from "./VoiceActivityCard";
import { TranscriptComposer } from "./TranscriptComposer";
import { ClinicSidebar } from "./ClinicSidebar";
import type { PaymentLinkCard, TranscriptMessage } from "./voice-reception-types";

type PaymentLinkData = {
  payment_page_url?: string;
  payment_url?: string;
  deposit_display?: string;
  email_sent?: boolean;
};

function extractUrls(text: string): string[] {
  const matches = text.match(/https?:\/\/[^\s]+/g);
  return matches ?? [];
}

function messageRole(event: { source?: string; role?: string }): "user" | "agent" {
  if (event.role === "user" || event.source === "user") return "user";
  return "agent";
}

function VoiceReceptionSession({
  agentId,
  slug,
  defaultDialCode,
  messages,
  paymentLinks,
  paymentLinkSent,
  setMessages,
  setPaymentLinks,
  setPaymentLinkSent,
  paymentLinkHandlerRef,
  pendingQuickActionRef,
}: {
  agentId: string;
  slug: string;
  defaultDialCode: string;
  messages: TranscriptMessage[];
  paymentLinks: PaymentLinkCard[];
  paymentLinkSent: boolean;
  setMessages: Dispatch<SetStateAction<TranscriptMessage[]>>;
  setPaymentLinks: Dispatch<SetStateAction<PaymentLinkCard[]>>;
  setPaymentLinkSent: Dispatch<SetStateAction<boolean>>;
  paymentLinkHandlerRef: React.MutableRefObject<((data: PaymentLinkData) => void) | null>;
  pendingQuickActionRef: React.MutableRefObject<string | null>;
}) {
  const { status } = useConversationStatus();
  const { isSpeaking } = useConversationMode();
  const { endSession, startSession, sendUserMessage } = useConversationControls();
  const endTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handlePaymentLink = useCallback(
    (data: PaymentLinkData) => {
      const url = data.payment_page_url ?? data.payment_url;
      if (!url) return;

      setPaymentLinkSent(true);
      setPaymentLinks((prev) => {
        if (prev.some((p) => p.url === url)) return prev;
        return [
          ...prev,
          {
            url,
            label: `Pay deposit${data.deposit_display ? ` (${data.deposit_display})` : ""}`,
            amountDisplay: data.deposit_display,
          },
        ];
      });

      const emailNote = data.email_sent
        ? "We emailed you the deposit link."
        : "Your deposit link is ready below.";
      setMessages((prev) => [
        ...prev,
        {
          id: `system-pay-${Date.now()}`,
          role: "agent",
          text: `${emailNote} Tap Pay securely when you're ready — no need to stay on the call.`,
        },
      ]);

      if (endTimerRef.current) clearTimeout(endTimerRef.current);
      endTimerRef.current = setTimeout(() => {
        void endSession();
      }, 3000);
    },
    [endSession, setMessages, setPaymentLinks, setPaymentLinkSent]
  );

  useEffect(() => {
    paymentLinkHandlerRef.current = handlePaymentLink;
    return () => {
      paymentLinkHandlerRef.current = null;
    };
  }, [handlePaymentLink, paymentLinkHandlerRef]);

  useEffect(() => {
    if (status !== "connected" || !pendingQuickActionRef.current) return;
    const msg = pendingQuickActionRef.current;
    pendingQuickActionRef.current = null;
    sendUserMessage(msg);
  }, [status, sendUserMessage, pendingQuickActionRef]);

  async function handleQuickAction(message: string) {
    if (paymentLinkSent) return;
    if (status === "connected") {
      sendUserMessage(message);
      return;
    }
    pendingQuickActionRef.current = message;
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      await startSession({ agentId });
    } catch {
      pendingQuickActionRef.current = null;
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
      <div className="space-y-4">
        <VoiceActivityCard
          agentId={agentId}
          isSpeaking={isSpeaking}
          paymentLinkSent={paymentLinkSent}
        />
      <ConversationTranscript
        messages={messages}
        paymentLinks={paymentLinks}
        status={status}
        composer={
            !paymentLinkSent ? (
              <TranscriptComposer disabled={paymentLinkSent} />
            ) : undefined
          }
        />
      </div>
      <ClinicSidebar
        slug={slug}
        defaultDialCode={defaultDialCode}
        onQuickAction={handleQuickAction}
      />
    </div>
  );
}

export function VoiceReception({
  agentId,
  slug,
  defaultDialCode = "54",
}: {
  agentId: string;
  slug: string;
  defaultDialCode?: string;
}) {
  const [messages, setMessages] = useState<TranscriptMessage[]>([]);
  const [paymentLinks, setPaymentLinks] = useState<PaymentLinkCard[]>([]);
  const [paymentLinkSent, setPaymentLinkSent] = useState(false);
  const agentSpeakingRef = useRef(false);
  const paymentLinkHandlerRef = useRef<((data: PaymentLinkData) => void) | null>(null);
  const pendingQuickActionRef = useRef<string | null>(null);

  const onModeChange = useCallback((prop: { mode: string }) => {
    agentSpeakingRef.current = prop.mode === "speaking";
  }, []);

  const onMessage = useCallback(
    (event: { source?: string; role?: string; message: string; event_id?: number }) => {
      const role = messageRole(event);
      const text = event.message?.trim();
      if (!text) return;

      if (role === "user" && agentSpeakingRef.current) return;

      setMessages((prev) => {
        if (event.event_id != null) {
          const idx = prev.findIndex((m) => m.eventId === event.event_id);
          if (idx >= 0) {
            const next = [...prev];
            next[idx] = { ...next[idx], text, role };
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
            return [...prev, { url, label: "Pay your deposit" }];
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
        const data = JSON.parse(response.full_tool_result ?? "{}") as PaymentLinkData;
        paymentLinkHandlerRef.current?.(data);
      } catch {
        // ignore malformed tool output
      }
    },
    []
  );

  const onDisconnect = useCallback(() => {
    setMessages((prev) => {
      if (prev.some((m) => m.id.startsWith("end-"))) return prev;
      return [
        ...prev,
        {
          id: `end-${Date.now()}`,
          role: "agent",
          text: "Call ended. Start a new call anytime if you need more help.",
        },
      ];
    });
  }, []);

  return (
    <ConversationProvider
      onMessage={onMessage}
      onModeChange={onModeChange}
      onAgentToolResponse={onAgentToolResponse}
      onDisconnect={onDisconnect}
    >
      <VoiceReceptionSession
        agentId={agentId}
        slug={slug}
        defaultDialCode={defaultDialCode}
        messages={messages}
        paymentLinks={paymentLinks}
        paymentLinkSent={paymentLinkSent}
        setMessages={setMessages}
        setPaymentLinks={setPaymentLinks}
        setPaymentLinkSent={setPaymentLinkSent}
        paymentLinkHandlerRef={paymentLinkHandlerRef}
        pendingQuickActionRef={pendingQuickActionRef}
      />
    </ConversationProvider>
  );
}
