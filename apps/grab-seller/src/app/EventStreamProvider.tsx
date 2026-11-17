import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  createBackendEventStream,
  resolveLink,
  SellerApiLinks,
  type BackendEventStreamState,
} from "@khinemyaezin/seller-api";
import { usePlatform, useSessionSnapshot } from "@khinemyaezin/seller-ui";
import { useEntryGet } from "../hooks/use-entry";
import { WorkflowEventStreamHandler } from "../services/workflow-sse-handler";
import type { SseHandler } from "../types/sse";

export type EventStreamStatus = "idle" | "connecting" | "open" | "reconnecting";

export interface EventStreamContextValue {
  status: EventStreamStatus;
  lastEventId?: string;
}

export const EventStreamContext = createContext<EventStreamContextValue>({
  status: "idle",
});

export function useEventStreamState(): EventStreamContextValue {
  return useContext(EventStreamContext);
}

function parseReadyProducerId(data: string): "backend" | "host" {
  try {
    const parsed = JSON.parse(data) as { producerId?: unknown };
    if (parsed.producerId === "host" || parsed.producerId === "backend") {
      return parsed.producerId;
    }
  } catch {
    // Fall back to default producer on malformed JSON
  }
  return "backend";
}

function fallbackEventStreamUrl(apiBaseUrl: string): string {
  return `${apiBaseUrl.replace(/\/$/, "")}/events/stream`;
}

export interface EventStreamProviderProps {
  children: ReactNode;
  handlers?: SseHandler[];
}

export function EventStreamProvider({ children, handlers }: EventStreamProviderProps) {
  const platform = usePlatform();
  const snapshot = useSessionSnapshot();
  const [status, setStatus] = useState<EventStreamStatus>("idle");
  const [lastEventId, setLastEventId] = useState<string | undefined>(undefined);

  const { data, isFetched } = useEntryGet({ href: platform?.config.apiBaseUrl ?? "/api" });

  const enabled = snapshot.status === "authenticated";
  const scopeId =
    snapshot.status === "authenticated" ? snapshot.user.currentAccessContext?.scopeId : undefined;

  const defaultWorkflowHandler = useMemo(() => new WorkflowEventStreamHandler(), []);
  const moduleHandlers = useMemo(
    () => handlers ?? [defaultWorkflowHandler],
    [handlers, defaultWorkflowHandler],
  );

  const streamUrl = useMemo(() => {
    if (platform?.config.eventStreamUrl) {
      return platform.config.eventStreamUrl;
    }
    const discovered = resolveLink(data?._links, SellerApiLinks.pending.eventStream)?.href;
    if (discovered) {
      return discovered;
    }
    if (isFetched && platform?.config.apiBaseUrl) {
      return fallbackEventStreamUrl(platform.config.apiBaseUrl);
    }
    return undefined;
  }, [data?._links, isFetched, platform?.config.apiBaseUrl, platform?.config.eventStreamUrl]);

  useEffect(() => {
    if (!platform || !enabled || !streamUrl) {
      setStatus("idle");
      return;
    }

    const events = platform.events;
    const controller = new AbortController();
    const storageKey = scopeId ? `sse:last-event-id:${scopeId}` : "sse:last-event-id";

    // Restore lastEventId from storage if present
    try {
      if (typeof window !== "undefined" && window.sessionStorage) {
        const stored = window.sessionStorage.getItem(storageKey);
        if (stored) {
          setLastEventId(stored);
        }
      }
    } catch {
      // Ignore storage access errors
    }

    void createBackendEventStream({
      url: streamUrl,
      signal: controller.signal,
      refresh: () => platform.session.refresh(),
      expire: (reason) => platform.session.expire(reason),
      storageKey,
      onStateChange: (state: BackendEventStreamState) => {
        if (!controller.signal.aborted) {
          setStatus(state);
        }
      },
      onFrame: (frame) => {
        if (frame.id) {
          setLastEventId(frame.id);
        }

        if (frame.event === "ready") {
          events.emit("stream:ready:v1", {
            producerId: parseReadyProducerId(frame.data),
            lastEventId: frame.id,
          });
          return;
        }

        for (const handler of moduleHandlers) {
          if (handler.handle(frame, events)) {
            return;
          }
        }
      },
      onDisconnected: () => {
        if (controller.signal.aborted) {
          return;
        }
        events.emit("stream:disconnected:v1", {
          producerId: "host",
          reason: "error",
        });
      },
    });

    return () => {
      controller.abort();
      setStatus("idle");

      const currentSnapshot = platform.session.getSnapshot();
      let reason: "abort" | "logout" | "context-change" = "abort";
      if (currentSnapshot.status !== "authenticated") {
        reason = "logout";
        try {
          if (typeof window !== "undefined" && window.sessionStorage) {
            window.sessionStorage.removeItem(storageKey);
          }
        } catch {
          // Ignore storage errors on cleanup
        }
      } else if (currentSnapshot.user.currentAccessContext?.scopeId !== scopeId) {
        reason = "context-change";
      }

      events.emit("stream:disconnected:v1", {
        producerId: "host",
        reason,
      });
    };
  }, [enabled, moduleHandlers, platform, scopeId, streamUrl]);

  const value = useMemo<EventStreamContextValue>(
    () => ({
      status,
      lastEventId,
    }),
    [lastEventId, status],
  );

  return <EventStreamContext.Provider value={value}>{children}</EventStreamContext.Provider>;
}
