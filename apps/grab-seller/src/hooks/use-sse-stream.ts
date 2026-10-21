import { useEffect, useMemo } from "react";
import { createBackendEventStream, resolveLink } from "@khinemyaezin/seller-api";
import type {
  SellerPlatform,
  SessionSnapshot,
} from "@khinemyaezin/seller-contracts";
import { useEntryGet } from "./use-entry";
import {
  WorkflowEventStreamHandler,
} from "../services/workflow-sse-handler";
import { SseHandler } from "src/types/sse";

function fallbackEventStreamUrl(apiBaseUrl: string): string {
  return `${apiBaseUrl.replace(/\/$/, "")}/events/stream`;
}

function parseReadyProducerId(data: string): "backend" | "host" {
  try {
    const parsed = JSON.parse(data) as { producerId?: unknown };
    if (parsed.producerId === "host" || parsed.producerId === "backend") {
      return parsed.producerId;
    }
  } catch {
  }
  return "backend";
}

export function useSseStream(
  platform: SellerPlatform,
  snapshot: SessionSnapshot,
  handlers?: SseHandler[],
): void {
  const { data, isFetched } = useEntryGet({ href: platform.config.apiBaseUrl });
  const events = platform.events;
  const refresh = platform.session.refresh;
  const scopeId =
    snapshot.status === "authenticated"
      ? snapshot.user.currentAccessContext?.scopeId
      : undefined;

  const moduleHandlers = useMemo(
    () => handlers ?? [new WorkflowEventStreamHandler()],
    [handlers],
  );

  const streamUrl = useMemo(() => {
    const discovered = resolveLink(data?._links, "event-stream")?.href;
    if (discovered) {
      return discovered;
    }
    if (isFetched) {
      return fallbackEventStreamUrl(platform.config.apiBaseUrl);
    }
    return undefined;
  }, [data?._links, isFetched, platform.config.apiBaseUrl]);

  useEffect(() => {
    if (snapshot.status !== "authenticated" || !streamUrl) {
      return;
    }

    const controller = new AbortController();
    const reason = "abort" as const;

    void createBackendEventStream({
      url: streamUrl,
      signal: controller.signal,
      refresh,
      onFrame: (frame) => {
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
      events.emit("stream:disconnected:v1", {
        producerId: "host",
        reason,
      });
    };
  }, [events, handlers, refresh, scopeId, snapshot.status, streamUrl]);
}
