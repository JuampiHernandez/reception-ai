"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    ElevenLabsConvAI?: { start: () => void };
  }
}

export function ElevenLabsWidget({ agentId }: { agentId: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!agentId || agentId === "placeholder") return;

    const script = document.createElement("script");
    script.src = "https://elevenlabs.io/convai-widget/index.js";
    script.async = true;
    script.onload = () => {
      if (!containerRef.current) return;
      const widget = document.createElement("elevenlabs-convai");
      widget.setAttribute("agent-id", agentId);
      containerRef.current.appendChild(widget);
    };
    document.body.appendChild(script);
    return () => {
      script.remove();
    };
  }, [agentId]);

  if (!agentId || agentId === "placeholder") {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
        <p className="font-semibold">ElevenLabs agent not configured</p>
        <p className="mt-2">
          Set <code className="rounded bg-amber-100 px-1">NEXT_PUBLIC_ELEVENLABS_AGENT_ID</code> in
          your .env file. See <code>elevenlabs/AGENT_SETUP.md</code> for full setup including server
          tools.
        </p>
        <p className="mt-4">
          You can still test the booking API at{" "}
          <code>/api/tools/smilecare/recommend_doctor</code>
        </p>
      </div>
    );
  }

  return <div ref={containerRef} className="min-h-[400px]" />;
}
