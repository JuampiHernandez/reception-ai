"use client";

import { useState } from "react";
import { useConversationControls, useConversationStatus } from "@elevenlabs/react";
import { Mic, Send } from "lucide-react";

export function TranscriptComposer({ disabled }: { disabled?: boolean }) {
  const { sendUserMessage } = useConversationControls();
  const { status } = useConversationStatus();
  const [text, setText] = useState("");

  const isConnected = status === "connected";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    if (!isConnected) return;
    sendUserMessage(trimmed);
    setText("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-slate-100 bg-white p-3"
    >
      <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2 focus-within:border-teal-300 focus-within:ring-2 focus-within:ring-teal-100">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={disabled}
          placeholder={
            disabled
              ? "Call ended"
              : "You can speak or type a message…"
          }
          className="min-w-0 flex-1 bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={disabled || !text.trim()}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-teal-600 transition hover:bg-teal-50 disabled:opacity-40"
          aria-label="Send message"
        >
          {text.trim() ? <Send className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        </button>
      </div>
    </form>
  );
}
