type ToolLogPayload = Record<string, unknown>;

export function toolLog(event: string, payload: ToolLogPayload = {}) {
  console.log(
    JSON.stringify({
      ts: new Date().toISOString(),
      event,
      ...payload,
    })
  );
}

export function toolDebugEnabled() {
  return process.env.TOOL_DEBUG === "1" || process.env.NODE_ENV === "development";
}

export function withToolDebug<T extends Record<string, unknown>>(
  data: T,
  debug?: Record<string, unknown>
) {
  if (!toolDebugEnabled() || !debug) return data;
  return { ...data, debug };
}
