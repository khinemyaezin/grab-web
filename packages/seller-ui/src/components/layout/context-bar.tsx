import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import type { PlatformEvents } from "@khinemyaezin/seller-contracts";
import { usePlatform } from "@/context";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ButtonStatus, type ButtonStatusState } from "@/components/ui/button-status";

const DEFAULT_SAVE_TIMEOUT_MS = 10_000;
const STATUS_RESET_MS = 2_000;

type DirtyEntry = {
  dirty: boolean;
  label?: string;
};

type SaveStatus = "success" | "failed";

function runSave(
  events: PlatformEvents,
  groupIds: string[],
  timeoutMs: number,
  producerId: string,
  signal: AbortSignal,
): Promise<Map<string, SaveStatus>> {
  return new Promise((resolve) => {
    if (groupIds.length === 0 || signal.aborted) {
      resolve(new Map());
      return;
    }

    const pending = new Set(groupIds);
    const results = new Map<string, SaveStatus>();
    const timers = new Map<string, ReturnType<typeof setTimeout>>();

    const cleanup = () => {
      for (const timer of timers.values()) {
        clearTimeout(timer);
      }
      timers.clear();
      unsubscribe();
      signal.removeEventListener("abort", onAbort);
    };

    const settle = (groupId: string, status: SaveStatus) => {
      if (!pending.has(groupId)) return;
      pending.delete(groupId);
      results.set(groupId, status);
      const timer = timers.get(groupId);
      if (timer) clearTimeout(timer);
      timers.delete(groupId);
      if (pending.size === 0) {
        cleanup();
        resolve(results);
      }
    };

    const onAbort = () => {
      for (const groupId of pending) {
        results.set(groupId, "failed");
      }
      pending.clear();
      cleanup();
      resolve(results);
    };

    signal.addEventListener("abort", onAbort, { once: true });

    const unsubscribe = events.subscribe(
      "form:saved:v1",
      (msg) => {
        settle(msg.groupId, msg.status);
      },
      { replay: false },
    );

    for (const groupId of groupIds) {
      timers.set(
        groupId,
        setTimeout(() => settle(groupId, "failed"), timeoutMs),
      );
      events.emit("form:save:v1", { producerId, groupId });
    }
  });
}

export type ContextBarProps = {
  saveTimeoutMs?: number;
  className?: string;
};

export function ContextBar({
  saveTimeoutMs = DEFAULT_SAVE_TIMEOUT_MS,
  className,
}: ContextBarProps) {
  const platform = usePlatform();
  const events = platform?.events;
  const instanceId = useId();
  const producerId = `context-bar-${instanceId}`;

  const [entries, setEntries] = useState<Map<string, DirtyEntry>>(new Map());
  const [status, setStatus] = useState<ButtonStatusState>("idle");
  const savingRef = useRef(false);
  const saveAbortControllerRef = useRef<AbortController | null>(null);
  const statusTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (!events) return;

    return events.subscribe("form:dirty:v1", (msg) => {
      setEntries((prev) => {
        const current = prev.get(msg.groupId);
        if (current && current.dirty === msg.payload.dirty && current.label === msg.payload.label) {
          return prev;
        }
        const next = new Map(prev);
        next.set(msg.groupId, { dirty: msg.payload.dirty, label: msg.payload.label });
        return next;
      });
    });
  }, [events]);

  useEffect(() => {
    return () => {
      saveAbortControllerRef.current?.abort();
      if (statusTimerRef.current !== undefined) {
        clearTimeout(statusTimerRef.current);
      }
    };
  }, []);

  const dirtyGroups = useMemo(
    () => [...entries].filter(([, entry]) => entry.dirty).map(([groupId]) => groupId),
    [entries],
  );
  const label = useMemo(() => {
    for (const [, entry] of entries) {
      if (entry.dirty && entry.label) return entry.label;
    }
    return undefined;
  }, [entries]);

  const handleSave = useCallback(async () => {
    if (!events || savingRef.current || dirtyGroups.length === 0) return;

    savingRef.current = true;
    if (statusTimerRef.current !== undefined) {
      clearTimeout(statusTimerRef.current);
    }
    setStatus("pending");

    const controller = new AbortController();
    saveAbortControllerRef.current = controller;

    try {
      const results = await runSave(
        events,
        dirtyGroups,
        saveTimeoutMs,
        producerId,
        controller.signal,
      );
      if (controller.signal.aborted) {
        return;
      }
      const failed = [...results.values()].some((result) => result === "failed");
      setStatus(failed ? "failed" : "success");

      events.emit("shell:toast:v1", {
        type: failed ? "error" : "success",
        message: failed ? "Failed to save changes" : "All changes saved successfully",
      });
    } catch {
      if (!controller.signal.aborted) {
        setStatus("failed");
        events.emit("shell:toast:v1", {
          type: "error",
          message: "Failed to save changes",
        });
      }
    } finally {
      savingRef.current = false;
      saveAbortControllerRef.current = null;
      statusTimerRef.current = setTimeout(() => setStatus("idle"), STATUS_RESET_MS);
    }
  }, [events, dirtyGroups, saveTimeoutMs, producerId]);

  const handleDiscard = useCallback(() => {
    if (!events || savingRef.current) return;

    for (const groupId of dirtyGroups) {
      events.emit("form:discard:v1", { producerId, groupId });
    }
  }, [events, dirtyGroups, producerId]);

  if (dirtyGroups.length === 0) return null;

  return (
    <div
      role="region"
      aria-label="Unsaved changes"
      className={cn(
        "sticky top-[var(--header-height,3rem)] z-10 flex items-center justify-between gap-4 border-b bg-background/90 px-4 py-2 backdrop-blur-md animate-in slide-in-from-top-2 fade-in duration-200 lg:px-6",
        className,
      )}
    >
      <p className="text-sm font-medium">Unsaved changes{label ? ` — ${label}` : ""}</p>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleDiscard}
          disabled={status === "pending"}
        >
          Discard
        </Button>
        <Button type="button" size="sm" onClick={handleSave} disabled={status === "pending"}>
          <ButtonStatus
            status={status}
            pendingLabel="Saving…"
            successLabel="Saved"
            failedLabel="Save failed"
          >
            Save
          </ButtonStatus>
        </Button>
      </div>
    </div>
  );
}
