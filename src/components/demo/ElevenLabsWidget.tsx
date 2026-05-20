"use client";

import { useEffect, useRef, useState } from "react";

const WIDGET_SCRIPT_ID = "elevenlabs-convai-widget-script";
const WIDGET_SCRIPT_SRC = "https://unpkg.com/@elevenlabs/convai-widget-embed";

function loadWidgetScript(): Promise<void> {
  if (customElements.get("elevenlabs-convai")) {
    return Promise.resolve();
  }

  const existing = document.getElementById(WIDGET_SCRIPT_ID) as HTMLScriptElement | null;
  if (existing) {
    if (existing.dataset.loaded === "true") {
      return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Failed to load widget")), {
        once: true,
      });
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.id = WIDGET_SCRIPT_ID;
    script.src = WIDGET_SCRIPT_SRC;
    script.async = true;
    script.type = "text/javascript";
    script.onload = () => {
      script.dataset.loaded = "true";
      resolve();
    };
    script.onerror = () => reject(new Error("Failed to load widget"));
    document.body.appendChild(script);
  });
}

export function ElevenLabsWidget({ agentId }: { agentId: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!agentId || agentId === "placeholder") return;

    let cancelled = false;

    loadWidgetScript()
      .then(() => {
        if (cancelled || !containerRef.current) return;
        containerRef.current.replaceChildren();
        const widget = document.createElement("elevenlabs-convai");
        widget.setAttribute("agent-id", agentId);
        widget.setAttribute("variant", "full");
        widget.style.display = "block";
        widget.style.width = "100%";
        widget.style.minHeight = "560px";
        widget.style.setProperty("--elevenlabs-convai-widget-width", "100%");
        widget.style.setProperty("--elevenlabs-convai-widget-height", "560px");
        containerRef.current.appendChild(widget);
      })
      .catch(() => {
        if (!cancelled) {
          setError("Could not load the ElevenLabs voice widget. Check your connection and try again.");
        }
      });

    return () => {
      cancelled = true;
      containerRef.current?.replaceChildren();
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

  if (!agentId.startsWith("agent_")) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
        <p className="font-semibold">Invalid ElevenLabs agent ID</p>
        <p className="mt-2">
          Use the full agent ID from the ElevenLabs console (starts with{" "}
          <code className="rounded bg-amber-100 px-1">agent_</code>), not the share-page or widget
          URL slug.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-900">
        <p className="font-semibold">Voice widget failed to load</p>
        <p className="mt-2">{error}</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="mx-auto flex min-h-[560px] w-full max-w-2xl items-center justify-center [&_elevenlabs-convai]:w-full"
    />
  );
}
