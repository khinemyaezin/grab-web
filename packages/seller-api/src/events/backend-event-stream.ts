import { consumeSseBuffer, type SseFrame } from "./sse-parser.js";

export type { SseFrame };

export type BackendEventStreamDisconnectReason = "error";
export type BackendEventStreamState = "connecting" | "open" | "reconnecting";

export type CreateBackendEventStreamOptions = {
  url: string;
  signal: AbortSignal;
  refresh: () => Promise<void>;
  expire?: (reason?: "refresh-failed" | "unauthorized") => void;
  onFrame: (frame: SseFrame) => void;
  onDisconnected?: (reason: BackendEventStreamDisconnectReason) => void;
  onStateChange?: (state: BackendEventStreamState) => void;
  fetchImpl?: typeof fetch;
  delay?: (ms: number, signal: AbortSignal) => Promise<void>;
  initialBackoffMs?: number;
  maxBackoffMs?: number;
  storageKey?: string;
  storage?: Storage | null;
};

export async function createBackendEventStream(
  options: CreateBackendEventStreamOptions,
): Promise<void> {
  const {
    url,
    signal,
    refresh,
    expire,
    onFrame,
    onDisconnected,
    onStateChange,
    fetchImpl = fetch,
    delay = delayRespectingAbort,
    initialBackoffMs = 1_000,
    maxBackoffMs = 30_000,
    storageKey,
    storage = typeof window !== "undefined" && window.sessionStorage ? window.sessionStorage : null,
  } = options;

  let lastEventId: string | undefined;
  if (storage && storageKey) {
    try {
      const stored = storage.getItem(storageKey);
      if (stored) {
        lastEventId = stored;
      }
    } catch {
      // Ignore storage access errors
    }
  }

  let backoffMs = initialBackoffMs;
  let refreshed = false;
  let attempt = 0;

  while (!signal.aborted) {
    onStateChange?.(attempt === 0 ? "connecting" : "reconnecting");
    attempt += 1;

    try {
      const headers: Record<string, string> = {
        Accept: "text/event-stream",
        "Cache-Control": "no-cache",
      };
      if (lastEventId) {
        headers["Last-Event-ID"] = lastEventId;
      }

      const response = await fetchImpl(url, {
        method: "GET",
        headers,
        credentials: "include",
        signal,
      });

      if (response.status === 401) {
        if (!refreshed) {
          try {
            await refresh();
            refreshed = true;
            continue;
          } catch (refreshErr: unknown) {
            const isAuthError =
              (refreshErr &&
                typeof refreshErr === "object" &&
                "status" in refreshErr &&
                ((refreshErr as { status: number }).status === 401 ||
                  (refreshErr as { status: number }).status === 403)) ||
              (refreshErr instanceof Error &&
                (refreshErr.message.includes("401") ||
                  refreshErr.message.includes("403") ||
                  refreshErr.message.toLowerCase().includes("unauthorized")));

            if (isAuthError) {
              expire?.("refresh-failed");
              return;
            }

            onDisconnected?.("error");
          }
        } else {
          expire?.("unauthorized");
          return;
        }
      } else if (!response.ok || !response.body) {
        throw new Error(`Event stream failed: ${response.status} ${response.statusText}`);
      } else {
        refreshed = false;
        backoffMs = initialBackoffMs;
        onStateChange?.("open");

        await readSseStream(response.body, signal, (frame) => {
          if (frame.id) {
            lastEventId = frame.id;
            if (storage && storageKey) {
              try {
                storage.setItem(storageKey, frame.id);
              } catch {
                // Ignore storage access errors
              }
            }
          }
          onFrame(frame);
        });

        if (signal.aborted) {
          return;
        }

        onDisconnected?.("error");
      }
    } catch {
      if (signal.aborted) {
        return;
      }
      onDisconnected?.("error");
    }

    if (signal.aborted) {
      return;
    }

    const jitter = 0.8 + Math.random() * 0.4;
    await delay(Math.round(backoffMs * jitter), signal);
    backoffMs = Math.min(backoffMs * 2, maxBackoffMs);
  }
}

async function readSseStream(
  body: ReadableStream<Uint8Array>,
  signal: AbortSignal,
  onFrame: (frame: SseFrame) => void,
): Promise<void> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (!signal.aborted) {
      const { done, value } = await reader.read();
      if (done) {
        buffer += decoder.decode();
        const { frames } = consumeSseBuffer(`${buffer}\n\n`);
        for (const frame of frames) {
          onFrame(frame);
        }
        return;
      }

      buffer += decoder.decode(value, { stream: true });
      const consumed = consumeSseBuffer(buffer);
      buffer = consumed.rest;
      for (const frame of consumed.frames) {
        onFrame(frame);
      }
    }
  } finally {
    reader.releaseLock();
  }
}

export function delayRespectingAbort(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve) => {
    if (signal.aborted) {
      resolve();
      return;
    }
    let timer: ReturnType<typeof setTimeout> | undefined;
    const onAbort = () => {
      if (timer !== undefined) {
        clearTimeout(timer);
        timer = undefined;
      }
      resolve();
    };
    timer = setTimeout(() => {
      signal.removeEventListener("abort", onAbort);
      resolve();
    }, ms);
    signal.addEventListener("abort", onAbort, { once: true });
  });
}
