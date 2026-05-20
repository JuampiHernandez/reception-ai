"use client";

import { useEffect, useRef } from "react";
import { Bot, User, Link2 } from "lucide-react";
import type { TranscriptMessage } from "./voice-reception-types";

function linkifyText(text: string) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);
  return parts.map((part, i) =>
    urlRegex.test(part) ? (
      <a
        key={i}
        href={part}
        target="_blank"
        rel="noopener noreferrer"
        className="break-all font-medium text-teal-700 underline hover:text-teal-900"
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
}: {
  messages: TranscriptMessage[];
  paymentLinks: Array<{ url: string; label: string }>;
  status: string;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, paymentLinks]);

  const isLive = status === "connected" || status === "connecting";

  return (
    <div className="flex min-h-[420px] flex-col rounded-xl border border-slate-100 bg-slate-50/80">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2">
        <span className="text-xs font-medium text-slate-500">Live transcript</span>
        {isLive && (
          <span className="flex items-center gap-1.5 text-xs text-teal-700">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-600" />
            </span>
            Recording
          </span>
        )}
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.length === 0 && paymentLinks.length === 0 && (
          <p className="py-12 text-center text-sm text-slate-500">
            Start a call below. Everything you and the receptionist say will appear here — including
            payment links you can tap.
          </p>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
          >
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                msg.role === "user" ? "bg-slate-200 text-slate-600" : "bg-teal-100 text-teal-700"
              }`}
            >
              {msg.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </div>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-white text-slate-800 shadow-sm"
                  : "bg-teal-600 text-white"
              }`}
            >
              {linkifyText(msg.text)}
            </div>
          </div>
        ))}

        {paymentLinks.map((link, i) => (
          <div
            key={`pay-${i}-${link.url}`}
            className="rounded-xl border border-teal-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start gap-2">
              <Link2 className="mt-0.5 h-5 w-5 shrink-0 text-teal-600" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-900">{link.label}</p>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 block break-all text-sm font-medium text-teal-700 underline hover:text-teal-900"
                >
                  {link.url}
                </a>
              </div>
            </div>
          </div>
        ))}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
