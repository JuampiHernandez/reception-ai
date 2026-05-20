"use client";

import { useEffect, useRef } from "react";
import { Bot, User, AudioLines } from "lucide-react";
import type { TranscriptMessage } from "./voice-reception-types";
import { DepositPaymentCard } from "./DepositPaymentCard";

function linkifyText(text: string, inAgentBubble: boolean) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);
  return parts.map((part, i) =>
    urlRegex.test(part) ? (
      <a
        key={i}
        href={part}
        target="_blank"
        rel="noopener noreferrer"
        className={`break-all font-medium underline ${
          inAgentBubble ? "text-teal-100" : "text-teal-700 hover:text-teal-900"
        }`}
      >
        {part}
      </a>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export function ConversationTranscript({
  messages,
  paymentLinks,
  status,
  composer,
}: {
  messages: TranscriptMessage[];
  paymentLinks: Array<{ url: string; label: string; amountDisplay?: string }>;
  status: string;
  composer?: React.ReactNode;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, paymentLinks]);

  const isLive = status === "connected" || status === "connecting";

  return (
    <div className="flex min-h-[320px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2.5">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Live transcript
        </span>
        {isLive && (
          <span className="flex items-center gap-1.5 text-xs font-medium text-teal-700">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-600" />
            </span>
            Recording
          </span>
        )}
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.length === 0 && paymentLinks.length === 0 && (
          <p className="py-10 text-center text-sm text-slate-500">
            Start a call above. Your conversation and payment link will appear here.
          </p>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex w-full flex-col gap-1 ${
              msg.role === "user" ? "items-end" : "items-start"
            }`}
          >
            <span className="px-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              {msg.role === "user" ? "You" : "AI Receptionist"}
            </span>
            <div
              className={`flex max-w-[88%] gap-2 ${
                msg.role === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                  msg.role === "user"
                    ? "bg-slate-100 text-slate-500"
                    : "bg-teal-600 text-white"
                }`}
              >
                {msg.role === "user" ? (
                  <User className="h-4 w-4" />
                ) : (
                  <Bot className="h-4 w-4" />
                )}
              </div>
              <div
                className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "rounded-br-sm border border-slate-200 bg-white text-slate-800 shadow-sm"
                    : "rounded-bl-sm border border-teal-100 bg-teal-50 text-slate-800"
                }`}
              >
                {msg.role === "agent" && isLive ? (
                  <div className="flex flex-col gap-1">
                    <AudioLines className="h-3 w-3 text-teal-500 opacity-70" />
                    <div>{linkifyText(msg.text, true)}</div>
                  </div>
                ) : (
                  linkifyText(msg.text, msg.role === "agent")
                )}
              </div>
            </div>
          </div>
        ))}

        {paymentLinks.map((link, i) => (
          <DepositPaymentCard
            key={`pay-${i}-${link.url}`}
            url={link.url}
            amountDisplay={
              link.amountDisplay ??
              (link.label.match(/\(\$[^)]+\)/)?.[0]?.slice(1, -1) ?? undefined)
            }
          />
        ))}

        <div ref={bottomRef} />
      </div>

      {composer}
    </div>
  );
}
