import { describe, expect, it, vi } from "vitest";
import { consumeSseBuffer } from "./sse-parser.js";
import {
  createBackendEventStream,
  delayRespectingAbort,
  type BackendEventStreamState,
} from "./backend-event-stream.js";

function sseResponse(chunks: string[], status = 200): Response {
  const encoder = new TextEncoder();
  let index = 0;
  const body = new ReadableStream<Uint8Array>({
    pull(controller) {
      if (index >= chunks.length) {
        controller.close();
        return;
      }
      controller.enqueue(encoder.encode(chunks[index]));
      index += 1;
    },
  });
  return new Response(body, {
    status,
    headers: { "Content-Type": "text/event-stream" },
  });
}

function createMockStorage(initialData: Record<string, string> = {}): Storage {
  const store = new Map<string, string>(Object.entries(initialData));
  return {
    getItem: vi.fn((key: string) => store.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store.set(key, value);
    }),
    removeItem: vi.fn((key: string) => {
      store.delete(key);
    }),
    clear: vi.fn(() => {
      store.clear();
    }),
    key: vi.fn((index: number) => Array.from(store.keys())[index] ?? null),
    get length() {
      return store.size;
    },
  };
}

describe("consumeSseBuffer", () => {
  it("drops comment-only heartbeat blocks", () => {
    const { frames, rest } = consumeSseBuffer(
      ': ping\n\nid: 1\nevent: ready\ndata: {"producerId":"backend"}\n\n',
    );

    expect(frames).toHaveLength(1);
    expect(frames[0]).toEqual({
      id: "1",
      event: "ready",
      data: '{"producerId":"backend"}',
    });
    expect(rest).toBe("");
  });

  it("joins multiline data and keeps a partial trailing block", () => {
    const { frames, rest } = consumeSseBuffer(
      'event: workflow\ndata: {"a":1}\ndata: {"b":2}\n\nevent: workflow\ndata: {',
    );

    expect(frames).toEqual([{ event: "workflow", data: '{"a":1}\n{"b":2}' }]);
    expect(rest).toBe("event: workflow\ndata: {");
  });
});

describe("createBackendEventStream", () => {
  it("parses ready and workflow frames and ignores comments", async () => {
    const frames: { event?: string; data: string }[] = [];
    const controller = new AbortController();

    await createBackendEventStream({
      url: "http://api.test/events/stream",
      signal: controller.signal,
      refresh: vi.fn(),
      onFrame: (frame) => {
        frames.push(frame);
        if (frames.length >= 2) {
          controller.abort();
        }
      },
      fetchImpl: vi.fn(async () =>
        sseResponse([
          ": ping\n\n",
          'id: evt-1\nevent: ready\ndata: {"producerId":"backend"}\n\n',
          'id: evt-2\nevent: workflow\ndata: {"workflowId":"wf-1","status":"COMPLETED"}\n\n',
        ]),
      ),
      delay: async () => undefined,
    });

    expect(frames.map((frame) => frame.event)).toEqual(["ready", "workflow"]);
  });

  it("refreshes on 401 then retry succeeds", async () => {
    const refresh = vi.fn(async () => undefined);
    const fetchImpl = vi.fn();
    const controller = new AbortController();
    let calls = 0;

    fetchImpl.mockImplementation(async (_url: string, init?: RequestInit) => {
      calls += 1;
      if (calls === 1) {
        return new Response(null, { status: 401 });
      }
      const headers = new Headers(init?.headers);
      expect(headers.get("Last-Event-ID")).toBeNull();
      controller.abort();
      return sseResponse(["id: evt-1\nevent: ready\ndata: {}\n\n"]);
    });

    await createBackendEventStream({
      url: "http://api.test/events/stream",
      signal: controller.signal,
      refresh,
      onFrame: () => undefined,
      fetchImpl,
      delay: async () => undefined,
    });

    expect(refresh).toHaveBeenCalledOnce();
    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });

  it("calls expire('refresh-failed') when refresh throws a 401 and stops retrying", async () => {
    const expire = vi.fn();
    const refreshError = new Error("401 Unauthorized");
    (refreshError as unknown as { status: number }).status = 401;
    const refresh = vi.fn().mockRejectedValue(refreshError);
    const controller = new AbortController();
    const fetchImpl = vi.fn().mockResolvedValue(new Response(null, { status: 401 }));

    await createBackendEventStream({
      url: "http://api.test/events/stream",
      signal: controller.signal,
      refresh,
      expire,
      onFrame: () => undefined,
      fetchImpl,
      delay: async () => undefined,
    });

    expect(refresh).toHaveBeenCalledOnce();
    expect(expire).toHaveBeenCalledWith("refresh-failed");
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it("backs off without expiring when refresh throws a network error", async () => {
    const expire = vi.fn();
    const refresh = vi.fn().mockRejectedValue(new TypeError("Network error"));
    const controller = new AbortController();
    const onDisconnected = vi.fn();
    let calls = 0;

    const fetchImpl = vi.fn().mockImplementation(async () => {
      calls += 1;
      if (calls >= 2) {
        controller.abort();
        return sseResponse([]);
      }
      return new Response(null, { status: 401 });
    });

    await createBackendEventStream({
      url: "http://api.test/events/stream",
      signal: controller.signal,
      refresh,
      expire,
      onFrame: () => undefined,
      onDisconnected,
      fetchImpl,
      delay: async () => undefined,
    });

    expect(expire).not.toHaveBeenCalled();
    expect(onDisconnected).toHaveBeenCalledWith("error");
    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });

  it("calls expire('unauthorized') if retry returns 401 again after refresh", async () => {
    const expire = vi.fn();
    const refresh = vi.fn().mockResolvedValue(undefined);
    const controller = new AbortController();
    const fetchImpl = vi.fn().mockResolvedValue(new Response(null, { status: 401 }));

    await createBackendEventStream({
      url: "http://api.test/events/stream",
      signal: controller.signal,
      refresh,
      expire,
      onFrame: () => undefined,
      fetchImpl,
      delay: async () => undefined,
    });

    expect(refresh).toHaveBeenCalledOnce();
    expect(expire).toHaveBeenCalledWith("unauthorized");
    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });

  it("emits onDisconnected at most once per failed attempt", async () => {
    const controller = new AbortController();
    const onDisconnected = vi.fn();
    let calls = 0;

    const fetchImpl = vi.fn().mockImplementation(async () => {
      calls += 1;
      if (calls > 3) {
        controller.abort();
      }
      throw new Error("Connection failed");
    });

    await createBackendEventStream({
      url: "http://api.test/events/stream",
      signal: controller.signal,
      refresh: vi.fn(),
      onFrame: () => undefined,
      onDisconnected,
      fetchImpl,
      delay: async () => undefined,
    });

    expect(calls).toBe(4);
    expect(onDisconnected).toHaveBeenCalledTimes(3);
  });

  it("tracks state changes: connecting -> open and reconnecting on error", async () => {
    const controller = new AbortController();
    const states: BackendEventStreamState[] = [];
    let calls = 0;

    const fetchImpl = vi.fn().mockImplementation(async () => {
      calls += 1;
      if (calls === 1) {
        return new Response(null, { status: 500 });
      }
      controller.abort();
      return sseResponse(["id: evt-1\nevent: ready\ndata: {}\n\n"]);
    });

    await createBackendEventStream({
      url: "http://api.test/events/stream",
      signal: controller.signal,
      refresh: vi.fn(),
      onFrame: () => undefined,
      onStateChange: (state) => states.push(state),
      fetchImpl,
      delay: async () => undefined,
    });

    expect(states).toContain("connecting");
    expect(states).toContain("reconnecting");
    expect(states).toContain("open");
  });

  it("restores Last-Event-ID from storage and persists new event ids", async () => {
    const controller = new AbortController();
    const storage = createMockStorage({ "test-scope": "stored-id-42" });
    const fetchImpl = vi.fn().mockImplementation(async (_url: string, init?: RequestInit) => {
      const headers = new Headers(init?.headers);
      expect(headers.get("Last-Event-ID")).toBe("stored-id-42");
      return sseResponse(["id: new-id-99\nevent: ready\ndata: {}\n\n"]);
    });

    await createBackendEventStream({
      url: "http://api.test/events/stream",
      signal: controller.signal,
      refresh: vi.fn(),
      storage,
      storageKey: "test-scope",
      onFrame: (frame) => {
        if (frame.id === "new-id-99") {
          controller.abort();
        }
      },
      fetchImpl,
      delay: async () => undefined,
    });

    expect(storage.getItem).toHaveBeenCalledWith("test-scope");
    expect(storage.setItem).toHaveBeenCalledWith("test-scope", "new-id-99");
  });

  it("sends Last-Event-ID after a prior frame id when reconnecting", async () => {
    const controller = new AbortController();
    const fetchImpl = vi.fn();
    let calls = 0;

    fetchImpl.mockImplementation(async (_url: string, init?: RequestInit) => {
      calls += 1;
      if (calls === 1) {
        return sseResponse(["id: evt-9\nevent: ready\ndata: {}\n\n"]);
      }
      const headers = new Headers(init?.headers);
      expect(headers.get("Last-Event-ID")).toBe("evt-9");
      controller.abort();
      return sseResponse([]);
    });

    await createBackendEventStream({
      url: "http://api.test/events/stream",
      signal: controller.signal,
      refresh: vi.fn(),
      onFrame: () => undefined,
      fetchImpl,
      delay: async () => undefined,
    });

    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });

  it("stops the reconnect loop when aborted", async () => {
    const controller = new AbortController();
    const fetchImpl = vi.fn(async () => {
      controller.abort();
      throw new DOMException("aborted", "AbortError");
    });

    await createBackendEventStream({
      url: "http://api.test/events/stream",
      signal: controller.signal,
      refresh: vi.fn(),
      onFrame: () => undefined,
      fetchImpl,
      delay: async () => undefined,
    });

    expect(fetchImpl).toHaveBeenCalledOnce();
  });
});

describe("delayRespectingAbort", () => {
  it("resolves immediately if already aborted", async () => {
    const controller = new AbortController();
    controller.abort();
    const start = Date.now();
    await delayRespectingAbort(10_000, controller.signal);
    expect(Date.now() - start).toBeLessThan(100);
  });

  it("aborts early when signal is aborted during delay and cleans up listeners", async () => {
    const controller = new AbortController();
    const promise = delayRespectingAbort(10_000, controller.signal);
    setTimeout(() => controller.abort(), 10);
    const start = Date.now();
    await promise;
    expect(Date.now() - start).toBeLessThan(500);
  });

  it("removes abort listener when delay completes normally", async () => {
    const controller = new AbortController();
    const removeSpy = vi.spyOn(controller.signal, "removeEventListener");
    await delayRespectingAbort(10, controller.signal);
    expect(removeSpy).toHaveBeenCalledWith("abort", expect.any(Function));
  });
});
